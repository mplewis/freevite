import type { APIGatewayEvent, Context } from 'aws-lambda'

import {
  tidyUnconfirmedEvents,
  tidyUnconfirmedResponses,
} from 'src/lib/backend/tidy'

export const handler = async (_event: APIGatewayEvent, _context: Context) => {
  await tidyUnconfirmedEvents()
  await tidyUnconfirmedResponses()
  return { statusCode: 200 }
}
