import { db } from '../../db'
import { logger } from '../logger'
import { send } from '../notification'
import { notiReminderDue } from '../notification/template/reminder'

/**
 * Send all outstanding reminder emails and mark them as sent.
 * @param now The time to use for determining which reminders are due
 */
export async function sendOutstandingReminders(now = new Date()) {
  const reminders = await db.reminder.findMany({
    where: { sent: false, sendAt: { lte: now }, response: { confirmed: true } },
    include: { response: { include: { event: true } } },
  })

  if (reminders.length === 0) {
    logger.info('No reminders to send')
    return
  }

  logger.info({ ids: reminders.map((r) => r.id) }, 'Sending reminders')

  await Promise.all(
    reminders.map(async (reminder) => {
      const noti = notiReminderDue(
        {
          title: reminder.response.event.title,
          timezone: reminder.response.event.timezone,
          slug: reminder.response.event.slug,
          start: reminder.response.event.end.toISOString(),
          end: reminder.response.event.end.toISOString(),
        },
        reminder.response,
        now
      )
      await send(noti)
      logger.info({ id: reminder.id }, 'Sent reminder')
      await db.reminder.update({
        where: { id: reminder.id },
        data: { sent: true },
      })
      logger.info({ id: reminder.id }, 'Marked reminder as sent')
    })
  )

  logger.info({ ids: reminders.map((r) => r.id) }, 'Sent all reminders')
}
