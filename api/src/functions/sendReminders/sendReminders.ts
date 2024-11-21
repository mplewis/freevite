import type { APIGatewayEvent, Context } from 'aws-lambda'

import { sendOutstandingReminders } from 'src/lib/backend/schedule/reminder'

export const handler = async (_event: APIGatewayEvent, _context: Context) => {
  await sendOutstandingReminders()
  return { statusCode: 200 }
}
