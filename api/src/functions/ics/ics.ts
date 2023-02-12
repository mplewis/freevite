import type { APIGatewayEvent, Context } from 'aws-lambda'
import { createEvent as _createEvent, EventAttributes } from 'ics'
import { Event } from 'types/graphql'

import { convertToDateArray, markdownToHTML } from 'src/lib/convert'
import { parseDurations } from 'src/lib/parse'
import { eventBySlug } from 'src/services/events/events'

function createEvent(attrs: EventAttributes): Promise<string> {
  return new Promise((resolve, reject) => {
    _createEvent(attrs, (error, value) => {
      if (error) reject(error)
      else resolve(value)
    })
  })
}

async function convertEvent(event: Event): Promise<EventAttributes> {
  if (typeof event.start === 'string') event.start = new Date(event.start)
  if (typeof event.end === 'string') event.end = new Date(event.end)

  const description = await markdownToHTML(event.description)
  const alarms = parseDurations(event.reminders).map(
    (duration) =>
      ({
        action: 'audio',
        trigger: { ...duration, before: true },
        description: event.title,
      } as const)
  )
  return {
    description,
    alarms,
    title: event.title,
    start: convertToDateArray(event.start),
    end: convertToDateArray(event.end),
    startInputType: 'utc',
    startOutputType: 'utc',
    endInputType: 'utc',
    endOutputType: 'utc',
  }
}

export async function handler(e: APIGatewayEvent, _context: Context) {
  const slug = e.queryStringParameters?.event
  if (!slug) return { statusCode: 400, body: 'Missing event slug' }
  const event = await eventBySlug({ slug })
  if (!event) return { statusCode: 404, body: 'Event not found' }

  const data = await convertEvent(event)
  let body: string
  try {
    body = await createEvent(data)
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
