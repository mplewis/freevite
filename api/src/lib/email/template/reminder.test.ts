/* eslint-disable max-len */

import { InMemoryMailHandler } from '@redwoodjs/mailer-handler-in-memory'

import { mailer } from '../../mailer'

import { sendReminder } from './reminder'

describe('with test handler', () => {
  const testHandler = mailer.getTestHandler() as InMemoryMailHandler
  beforeEach(() => {
    testHandler.clearInbox()
  })

  describe('sendReminder', () => {
    it('sends the expected email', async () => {
      const now = new Date('2022-12-24T12:00:00Z')
      const event = {
        title: "Emma's Holiday Party",
        start: '2022-12-25T12:00:00Z',
        end: '2022-12-25T15:00:00Z',
        timezone: 'America/New_York',
        slug: 'emmas-holiday-party',
      }
      const response = {
        email: 'holmes@example.com',
      }

      await sendReminder({ event, response, now })
      expect(testHandler.inbox).toHaveLength(1)
      expect(testHandler.inbox[0]).toMatchInlineSnapshot(`
{
  "attachments": [],
  "bcc": [],
  "cc": [],
  "from": ""Freevite Test" <test@freevite.app>",
  "handler": "nodemailer",
  "handlerOptions": undefined,
  "headers": {},
  "htmlContent": "Hello from Freevite! You asked for a reminder about this event when you RSVPed:<br><br>Emma&#39;s Holiday Party<br>Starts at: Sun Dec 25, 2022, 7:00 AM EST (in a day))<br>Ends at: Sun Dec 25, 2022, 10:00 AM EST (3 hours long)<br><br>View the event here:<br>https://example.com/events/emmas-holiday-party<br><br>Thanks for using Freevite!",
  "renderer": "plain",
  "rendererOptions": {},
  "replyTo": undefined,
  "subject": "Reminder: Emma's Holiday Party (a day away)",
  "textContent": "Hello from Freevite! You asked for a reminder about this event when you RSVPed:

Emma's Holiday Party
Starts at: Sun Dec 25, 2022, 7:00 AM EST (in a day))
Ends at: Sun Dec 25, 2022, 10:00 AM EST (3 hours long)

View the event here:
https://example.com/events/emmas-holiday-party

Thanks for using Freevite!",
  "to": [
    "holmes@example.com",
  ],
}
`)
    })
  })
})
