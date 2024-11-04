import type { APIGatewayEvent, Context } from 'aws-lambda'

import { logger } from 'src/lib/logger'
import { sendOutstandingReminders } from 'src/lib/schedule/reminder'

export const handler = async (_event: APIGatewayEvent, _context: Context) => {
  console.log('console.log: start sendReminders')
  logger.info('Start: sendOutstandingReminders')
  await sendOutstandingReminders()
  console.log('console.log: finish sendReminders')
  logger.info('Finish: sendOutstandingReminders')
  return { statusCode: 200 }
}
