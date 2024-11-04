import type { APIGatewayEvent, Context } from 'aws-lambda'

import { logger } from 'src/lib/logger'
import { sendOutstandingReminders } from 'src/lib/schedule/reminder'

export const handler = async (_event: APIGatewayEvent, _context: Context) => {
  logger.info('Start: sendOutstandingReminders')
  await sendOutstandingReminders()
  logger.info('Finish: sendOutstandingReminders')
  return { statusCode: 200 }
}
