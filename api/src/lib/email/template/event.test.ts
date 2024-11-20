/* eslint-disable max-len */

import { InMemoryMailHandler } from '@redwoodjs/mailer-handler-in-memory'

import { mailer } from '../../mailer'

import { sendEventDetails } from './event'

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
  "htmlContent": null,
  "renderer": "plain",
  "rendererOptions": {},
  "replyTo": undefined,
  "subject": "Manage your event: Emma's Holiday Party",
  "textContent": "Hello from Freevite! Click this link to manage your event details and make it public:

https://example.com/edit?token=SOME-EDIT-TOKEN

You must click the above link within 24 hours to confirm your email address.
Otherwise, we will automatically delete your event. Feel free to recreate it.

If you did not create this event, you can ignore this email and this event will be deleted.

If you need any help, just reply to this email. Thanks for using Freevite!

To unsubscribe from all Freevite emails forever, click here:
https://example.com/unsubscribe?email=emma%40example.com&token=8RHP9HXHbkVfnYJ_6H5xSWGL6_5o6Er7aeoYW5SBGNg",
  "to": [
    "emma@example.com",
  ],
}
`)
    })
  })
})
