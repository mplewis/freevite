import type { APIGatewayEvent } from 'aws-lambda'
import { createEvent, EventAttributes } from 'ics'

import { convertToDateArray } from 'src/lib/date'
import { markdownToHTML } from 'src/lib/markdown'
import { wrap } from 'src/lib/sentry'
import { eventBySlug } from 'src/services/events/events'

export interface Event {
  title: string
  description: string
  start: string | Date
  end: string | Date
}

function buildICSEvent(attrs: EventAttributes): Promise<string> {
  return new Promise((resolve, reject) => {
    createEvent(attrs, (error, value) => {
      if (error) reject(error)
      else resolve(value)
    })
  })
}

async function convertEvent(event: Event): Promise<EventAttributes> {
  if (typeof event.start === 'string') event.start = new Date(event.start)
  if (typeof event.end === 'string') event.end = new Date(event.end)

  const description = await markdownToHTML(event.description)
  return {
    description,
    title: event.title,
    start: convertToDateArray(event.start),
    end: convertToDateArray(event.end),
    startInputType: 'utc',
    startOutputType: 'utc',
    endInputType: 'utc',
    endOutputType: 'utc',
  }
}

async function baseHandler(e: APIGatewayEvent) {
  const slug = e.queryStringParameters?.event
  if (!slug) return { statusCode: 400, body: 'Missing event slug' }
  const event = await eventBySlug({ slug })
  if (!event) return { statusCode: 404, body: 'Event not found' }

  const data = await convertEvent(event)
  let body: string
  try {
    body = await buildICSEvent(data)
  } catch (e) {
    return { statusCode: 500, body: e }
  }

  return {
    body,
    statusCode: 200,
    headers: {
      'Content-Type': 'text/calendar',
      'Content-Disposition': `attachment; filename="${event.title}.ics"`,
    },
  }
}

export const handler = wrap(baseHandler)
