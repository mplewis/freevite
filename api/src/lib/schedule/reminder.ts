import { db } from '../db'
import { sendReminder } from '../email/template'

/**
 * Send all outstanding reminder emails and mark them as sent.
 * @param now The time to use for determining which reminders are due
 */
export async function sendOutstandingReminders(now = new Date()) {
  const reminders = await db.reminder.findMany({
    where: { sent: false, sendAt: { lte: now }, response: { confirmed: true } },
    include: { response: { include: { event: true } } },
  })

  await Promise.all(
    reminders.map(async (reminder) => {
      await sendReminder({
        event: {
          ...reminder.response.event,
          start: reminder.response.event.end.toISOString(),
          end: reminder.response.event.end.toISOString(),
        },
        response: reminder.response,
        now,
      })
      await db.reminder.update({
        where: { id: reminder.id },
        data: { sent: true },
      })
    })
  )
}
