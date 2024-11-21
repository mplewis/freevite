import { db } from '../../db'

import { sendOutstandingReminders } from './reminder'

const eventData = {
  data: {
    title: "Daria's Birthday Party",
    description: 'There will be cake! You should come!',
    start: new Date('2024-01-01T12:00:00Z'),
    end: new Date('2024-01-01T15:00:00Z'),
    timezone: 'America/Denver',
    ownerEmail: 'daria@example.com',
    editToken: 'SOME-EDIT-TOKEN',
    previewToken: 'SOME-PREVIEW-TOKEN',
    slug: 'darias-birthday-party',

    responses: {
      create: [
        {
          name: 'Jane Lane',
          email: 'jane@example.com',
          headCount: 2,
          comment: 'Looking forward to it!',
          confirmed: true,
          editToken: 'SOME-OTHER-EDIT-TOKEN',

          reminders: {
            create: [
              // To send
              {
                sendAt: new Date('2023-12-31T12:00:00Z'),
                sent: false,
              },

              // Won't resend
              {
                sendAt: new Date('2023-12-31T12:00:00Z'),
                sent: true,
              },
            ],
          },
        },

        {
          name: 'Trent Kellius',
          email: 'trent@example.com',
          headCount: 1,
          comment: 'I might be a little late',
          confirmed: false,
          editToken: 'SOME-NEW-EDIT-TOKEN',

          reminders: {
            create: [
              // Won't send, not confirmed
              {
                sendAt: new Date('2023-12-31T12:00:00Z'),
                sent: false,
              },
            ],
          },
        },
      ],
    },
  },
}

describe('with an event, response, and reminders', () => {
  beforeEach(async () => {
    await db.event.deleteMany()
    await db.event.create(eventData)
  })

  afterEach(async () => {
    await db.event.deleteMany()
  })

  describe('sendOutstandingReminders', () => {
    it('sends reminders that are due', async () => {
      expect(await db.reminder.count({ where: { sent: true } })).toEqual(1)
      await sendOutstandingReminders(new Date('2023-12-31T12:00:00Z'))
      expect(await db.reminder.count({ where: { sent: true } })).toEqual(2)
    })
  })
})
