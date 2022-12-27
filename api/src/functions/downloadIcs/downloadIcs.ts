import type { APIGatewayEvent, Context } from 'aws-lambda'
import { createEvent as _createEvent, EventAttributes } from 'ics'

import { convertToEvent } from 'src/lib/convert'
import { UserSchema } from 'src/lib/types'

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
