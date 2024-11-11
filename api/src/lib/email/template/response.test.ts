/* eslint-disable max-len */

import { InMemoryMailHandler } from '@redwoodjs/mailer-handler-in-memory'

import { mailer } from '../../mailer'

import {
  sendNewResponseReceived,
  sendResponseConfirmation,
  sendResponseDeleted,
} from './response'

describe('with test handler', () => {
  const testHandler = mailer.getTestHandler() as InMemoryMailHandler
  beforeEach(() => {
    testHandler.clearInbox()
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
  "htmlContent": "Hello from Freevite!<br><br>Click here to confirm you&#39;re attending Emma&#39;s Holiday Party:<br>https://example.com/rsvp?token=SOME-EDIT-TOKEN<br>Once you do, we&#39;ll confirm your RSVP and notify the event organizer.<br><br>To change your response or delete your RSVP, click the link above.<br><br>If you did not RSVP to this event, you can ignore this email.",
  "renderer": "plain",
  "rendererOptions": {},
  "replyTo": undefined,
  "subject": "Confirm your RSVP to Emma's Holiday Party",
  "textContent": "Hello from Freevite!

Click here to confirm you're attending Emma's Holiday Party:
https://example.com/rsvp?token=SOME-EDIT-TOKEN
Once you do, we'll confirm your RSVP and notify the event organizer.

To change your response or delete your RSVP, click the link above.

If you did not RSVP to this event, you can ignore this email.",
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
  "htmlContent": "Hello from Freevite! Sherlock Holmes has confirmed they are attending Emma&#39;s Holiday Party:<br><br>Name: Sherlock Holmes<br>Guests: 2<br>Comment: Looking forward to it!<br><br>To view all responses and manage your event, click here:<br>https://example.com/edit?token=SOME-EDIT-TOKEN<br><br>Thanks for using Freevite!",
  "renderer": "plain",
  "rendererOptions": {},
  "replyTo": undefined,
  "subject": "New RSVP: Sherlock Holmes (2) are attending Emma's Holiday Party",
  "textContent": "Hello from Freevite! Sherlock Holmes has confirmed they are attending Emma's Holiday Party:

Name: Sherlock Holmes
Guests: 2
Comment: Looking forward to it!

To view all responses and manage your event, click here:
https://example.com/edit?token=SOME-EDIT-TOKEN

Thanks for using Freevite!",
  "to": [
    "emma@example.com",
  ],
}
`)
    })
  })

  describe('sendResponseDeleted', () => {
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
      await sendResponseDeleted({ event, response })

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
  "htmlContent": "Hello from Freevite! Sherlock Holmes has canceled their RSVP to Emma&#39;s Holiday Party.<br><br>Here are the details of the RSVP before it was canceled:<br>Name: Sherlock Holmes<br>Guests: 2<br>Comment: Looking forward to it!<br><br>To view all RSVPs and manage your event, click here:<br>https://example.com/edit?token=SOME-EDIT-TOKEN<br><br>Thanks for using Freevite!",
  "renderer": "plain",
  "rendererOptions": {},
  "replyTo": undefined,
  "subject": "RSVP canceled: Sherlock Holmes",
  "textContent": "Hello from Freevite! Sherlock Holmes has canceled their RSVP to Emma's Holiday Party.

Here are the details of the RSVP before it was canceled:
Name: Sherlock Holmes
Guests: 2
Comment: Looking forward to it!

To view all RSVPs and manage your event, click here:
https://example.com/edit?token=SOME-EDIT-TOKEN

Thanks for using Freevite!",
  "to": [
    "emma@example.com",
  ],
}
`)
    })
  })
})
