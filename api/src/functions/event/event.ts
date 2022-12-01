import type { APIGatewayEvent, Context } from 'aws-lambda'
import {
  ActionType,
  Alarm,
  createEvent as _createEvent,
  DurationObject,
  EventAttributes,
} from 'ics'
import { z } from 'zod'

import { logger } from 'src/lib/logger'

const Schema = z.object({
  title: z.string(),
  description: z.string(),
  start: z.number().array().length(5).transform(castToFiveNumbers),
  end: z.number().array().length(5).transform(castToFiveNumbers),
  alarms: z.string().optional(),
  action: z.string().optional().transform(castToActionType),
})

function castToFiveNumbers(
  ns: number[]
): [number, number, number, number, number] {
  if (ns.length !== 5) throw new Error(`Expected 5 numbers, got ${ns}`)
  return ns as [number, number, number, number, number]
}

// export type ActionType = 'audio' | 'display' | 'email' | 'procedure' | undefined
function castToActionType(s?: string): ActionType | undefined {
  const valid = ['audio', 'display', 'email', 'procedure', undefined]
  if (!valid.includes(s))
    throw new Error(`Invalid action type: expected one of ${valid}, got ${s}`)
  return s as ActionType | undefined
}

function parseUnit(
  unit: string
): 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds' {
  switch (unit) {
    case 'w':
      return 'weeks'
    case 'd':
      return 'days'
    case 'h':
      return 'hours'
    case 'm':
      return 'minutes'
    case 's':
      return 'seconds'
    default:
      throw new Error(`Invalid duration unit: ${unit}`)
  }
}

export function parseDuration(s: string): DurationObject {
  const matcher = /(\d+)\s*(w|d|h|m|s)[^\d]*/g
  const sl = s.toLowerCase()
  const d: DurationObject = {}
  let matches: string[] | null
  while ((matches = matcher.exec(sl))) {
    const n = parseInt(matches[1], 10)
    const unit = parseUnit(matches[2])
    d[unit] = n
  }
  return d
}

function createEvent(attrs: EventAttributes): Promise<string> {
  return new Promise((resolve, reject) => {
    _createEvent(attrs, (error, value) => {
      if (error) reject(error)
      else resolve(value)
    })
  })
}

/**
 * The handler function is your code that processes http request events.
 * You can use return and throw to send a response or error, respectively.
 *
 * Important: When deployed, a custom serverless function is an open API endpoint and
 * is your responsibility to secure appropriately.
 *
 * @see {@link https://redwoodjs.com/docs/serverless-functions#security-considerations|Serverless Function Considerations}
 * in the RedwoodJS documentation for more information.
 *
 * @typedef { import('aws-lambda').APIGatewayEvent } APIGatewayEvent
 * @typedef { import('aws-lambda').Context } Context
 * @param { APIGatewayEvent } event - an object which contains information from the invoker.
 * @param { Context } _context - contains information about the invocation,
 * function, and execution environment.
 */
export const handler = async (event: APIGatewayEvent, _context: Context) => {
  logger.info('Invoked event function')

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' }
  }
  const contentType = event.headers['content-type']?.toLowerCase()
  if (!contentType?.startsWith('application/json')) {
    return { statusCode: 415, body: 'Unsupported media type' }
  }
  if (!event.body) {
    return { statusCode: 400, body: 'Missing request body' }
  }

  let body: unknown
  try {
    body = JSON.parse(event.body)
  } catch (e) {
    return { statusCode: 400, body: e }
  }
  const result = Schema.safeParse(body)
  if (result.success === false) {
    return { statusCode: 400, body: result.error }
  }

  let icsData: string
  try {
    icsData = await createEvent(result.data)
  } catch (e) {
    return { statusCode: 500, body: e }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: icsData }),
  }
}
