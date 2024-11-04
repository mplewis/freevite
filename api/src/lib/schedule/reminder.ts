// import { db } from '../db'

// /**
//  *
//  */
// export async function sendOutstandingReminders(now = new Date()) {
//   const reminders = await db.reminder.findMany({
//     where: { confirmed: true, sent: false, sendAt: { lte: now } },
//     include: { response: { include: { event: true } } },
//   })

//   await Promise.all(
//     reminders.map(async (reminder) => {
//       await sendReminder(reminder)
//     })
//   )
// }
