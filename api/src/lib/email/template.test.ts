/* eslint-disable max-len */

import { InMemoryMailHandler } from '@redwoodjs/mailer-handler-in-memory'

import { mailer } from '../mailer'

import {
  sendEventDetails,
  sendNewResponseReceived,
  sendReminder,
  sendResponseConfirmation,
} from './template'

describe('with test handler', () => {
  const testHandler = mailer.getTestHandler() as InMemoryMailHandler
  beforeEach(() => {
    testHandler.clearInbox()
  })

  describe('sendEventDetails', () => {
    it('sends the expected email', async () => {
      const event = {
        ownerEmail: 'emma@example.com',
        title: "Emma's Holiday Party",
        editToken: 'SOME-EDIT-TOKEN',
      }
      await sendEventDetails(event)

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
  "htmlContent": "Hello from Freevite! Click this link to manage your event details and make it public:<br><br>https://example.com/edit?token=SOME-EDIT-TOKEN<br><br>You must click the above link within 24 hours to confirm your email address.<br>Otherwise, we will automatically delete your event. Feel free to recreate it.<br><br>If you did not create this event, you can ignore this email and this event will be deleted.<br><br>If you need any help, just reply to this email. Thanks for using Freevite!",
  "renderer": "plain",
  "rendererOptions": {},
  "replyTo": undefined,
  "subject": "Manage your event: Emma's Holiday Party",
  "textContent": "Hello from Freevite! Click this link to manage your event details and make it public:

https://example.com/edit?token=SOME-EDIT-TOKEN

You must click the above link within 24 hours to confirm your email address.
Otherwise, we will automatically delete your event. Feel free to recreate it.

If you did not create this event, you can ignore this email and this event will be deleted.

If you need any help, just reply to this email. Thanks for using Freevite!",
  "to": [
    "emma@example.com",
  ],
}
`)
    })
  })

  describe('sendResponseConfirmation', () => {
    it('sends the expected email', async () => {
      const event = {
        title: "Emma's Holiday Party",
      }
      const response = {
        email: 'holmes@example.com',
        editToken: 'SOME-EDIT-TOKEN',
      }
      await sendResponseConfirmation({ event, response })

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
  "htmlContent": "Hello from Freevite! Click this link to confirm your attendance of Emma&#39;s Holiday Party:<br><br>https://example.com/rsvp?token=SOME-EDIT-TOKEN<br><br>You must click the above link to confirm your RSVP.<br>Once you do, we&#39;ll let the organizer know you are attending.<br><br>If you did not RSVP to this event, you can ignore this email.<br><br>To modify or delete your RSVP, just reply to this email. Thanks for using Freevite!",
  "renderer": "plain",
  "rendererOptions": {},
  "replyTo": undefined,
  "subject": "Confirm your RSVP to Emma's Holiday Party",
  "textContent": "Hello from Freevite! Click this link to confirm your attendance of Emma's Holiday Party:

https://example.com/rsvp?token=SOME-EDIT-TOKEN

You must click the above link to confirm your RSVP.
Once you do, we'll let the organizer know you are attending.

If you did not RSVP to this event, you can ignore this email.

To modify or delete your RSVP, just reply to this email. Thanks for using Freevite!",
  "to": [
    "holmes@example.com",
  ],
}
`)
    })
  })

  describe('sendNewResponseReceived', () => {
    it('sends the expected email', async () => {
      const event = {
        title: "Emma's Holiday Party",
        ownerEmail: 'emma@example.com',
        editToken: 'SOME-EDIT-TOKEN',
      }
      const response = {
        name: 'Sherlock Holmes',
        headCount: 2,
        comment: 'Looking forward to it!',
      }
      await sendNewResponseReceived({ event, response })

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
  "htmlContent": "Hello from Freevite! Sherlock Holmes has confirmed they are attending Emma&#39;s Holiday Party:<br><br>Name: Sherlock Holmes<br>Guests: 2<br>Comment: Looking forward to it!<br><br>To view all responses and manage your event, visit:<br><br>https://example.com/edit?token=SOME-EDIT-TOKEN<br><br>If you need any help, just reply to this email. Thanks for using Freevite!",
  "renderer": "plain",
  "rendererOptions": {},
  "replyTo": undefined,
  "subject": "New RSVP: Sherlock Holmes (2) are attending Emma's Holiday Party",
  "textContent": "Hello from Freevite! Sherlock Holmes has confirmed they are attending Emma's Holiday Party:

Name: Sherlock Holmes
Guests: 2
Comment: Looking forward to it!

To view all responses and manage your event, visit:

https://example.com/edit?token=SOME-EDIT-TOKEN

If you need any help, just reply to this email. Thanks for using Freevite!",
  "to": [
    "emma@example.com",
  ],
}
`)
    })
  })

  describe('sendNewResponseReceived', () => {
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
  "htmlContent": "Hello from Freevite! You asked for a reminder about this event when you RSVPed:<br><br>Emma&#39;s Holiday Party<br>Starts at: Sun Dec 25, 2022, 7:00 AM EST (in a day))<br>Ends at: Sun Dec 25, 2022, 10:00 AM EST (3 hours long)<br><br>View the event here:<br>https://example.com/events/emmas-holiday-party<br><br>If you need to modify or delete your RSVP, just reply to this email.<br>Thanks for using Freevite!",
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

If you need to modify or delete your RSVP, just reply to this email.
Thanks for using Freevite!",
  "to": [
    "holmes@example.com",
  ],
}
`)
    })
  })
})
