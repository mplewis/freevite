import type { APIGatewayEvent, Context } from 'aws-lambda'
import {
  Alarm,
  createEvent as _createEvent,
  DateArray,
  DurationObject,
  EventAttributes,
} from 'ics'
import { z } from 'zod'

const DateSchema = z
  .string()
  .refine((s) => !isNaN(Date.parse(s)), { message: 'Invalid date' })
  .transform((s) => new Date(s))

export const UserSchema = z.object({
  title: z.string(),
  description: z.string(),
  start: DateSchema,
  end: DateSchema,
  alarms: z.string().optional(),
})

export type UserSchema = z.infer<typeof UserSchema>

export function convertToEvent(data: UserSchema): EventAttributes {
  let alarms: Alarm[] = []
  if (data.alarms)
    alarms = parseDurations(data.alarms).map((duration) => ({
      action: 'audio',
      trigger: { ...duration, before: true },
      description: data.title,
    }))
  return {
    ...data,
    alarms,
    startInputType: 'utc',
    startOutputType: 'utc',
    endInputType: 'utc',
    endOutputType: 'utc',
    start: convertToDateArray(data.start),
    end: convertToDateArray(data.end),
  }
}

function convertToDateArray(d: Date): DateArray {
  return [
    d.getUTCFullYear(),
    d.getUTCMonth() + 1,
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
  ]
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

export function parseDurations(s: string): DurationObject[] {
  return s.split(',').map(parseDuration)
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
  const result = UserSchema.safeParse(body)
  if (result.success === false) {
    return { statusCode: 400, body: result.error }
  }

  let icsStr: string
  let icsData: EventAttributes
  try {
    icsData = convertToEvent(result.data)
    icsStr = await createEvent(icsData)
  } catch (e) {
    return { statusCode: 500, body: e }
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/calendar',
      'Content-Disposition': `attachment; filename="${icsData.title}.ics"`,
    },
    body: icsStr,
  }
}
