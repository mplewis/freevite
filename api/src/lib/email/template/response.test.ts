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
  "htmlContent": null,
  "renderer": "plain",
  "rendererOptions": {},
  "replyTo": undefined,
  "subject": "Confirm your RSVP to Emma's Holiday Party",
  "textContent": "Hello from Freevite!

Click here to confirm you're attending Emma's Holiday Party:
https://example.com/rsvp?token=SOME-EDIT-TOKEN
Once you do, we'll confirm your RSVP and notify the event organizer.

To change your response or delete your RSVP, click the link above.

If you did not RSVP to this event, you can ignore this email.

To unsubscribe from all Freevite emails forever, click here:
https://example.com/unsubscribe?email=holmes%40example.com&token=xZPATAWTt2b9dRKrUFJ9yE982ThnnvUg6APxtN_gr8s",
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
  "htmlContent": null,
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

Thanks for using Freevite!

To unsubscribe from all Freevite emails forever, click here:
https://example.com/unsubscribe?email=emma%40example.com&token=oyTyug8SP9wjzqGkAI7AKThdFp4hQs0bBLAPfq1SbRs",
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
  "htmlContent": null,
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

Thanks for using Freevite!

To unsubscribe from all Freevite emails forever, click here:
https://example.com/unsubscribe?email=emma%40example.com&token=oyTyug8SP9wjzqGkAI7AKThdFp4hQs0bBLAPfq1SbRs",
  "to": [
    "emma@example.com",
  ],
}
`)
    })
  })
})
