import { InMemoryMailHandler } from '@redwoodjs/mailer-handler-in-memory'

import { db } from '../db'
import { mailer } from '../mailer'

import { sendEmail } from './send'

describe('mailer', () => {
  const testHandler = mailer.getTestHandler() as InMemoryMailHandler
  beforeEach(async () => {
    await testHandler.clearInbox()
  })

  it('sends an email', async () => {
    expect(testHandler.inbox).toHaveLength(0)

    const params = {
      to: 'darlene@fs0ciety.pizza',
      subject: "Don't delete me",
      text: 'Leave this email here',
    }

    await sendEmail(params)

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
  "subject": "Don't delete me",
  "textContent": "Leave this email here

To unsubscribe from all Freevite emails forever, click here:
https://example.com/unsubscribe?email=darlene%40fs0ciety.pizza&token=wgPFf2G9H7D9zKIEjop_AeZCED7pLZex619NqYasXwk",
  "to": [
    "darlene@fs0ciety.pizza",
  ],
}
`)
  })

  describe('when users are on the ignore list', () => {
    beforeEach(async () => {
      await db.ignoredEmail.create({ data: { email: 'wh1ter0se@da.cn' } })
    })
    afterEach(async () => {
      await db.ignoredEmail.deleteMany()
    })

    it('obeys the ignore list', async () => {
      expect(testHandler.inbox).toHaveLength(0)
      await sendEmail({
        to: 'wh1ter0se@da.cn',
        subject: "You're invited to End of the World Party",
        text: 'Bring your own mask',
      })
      expect(testHandler.inbox).toHaveLength(0)

      // but it still sends to other addresses
      await sendEmail({
        to: 'ealderson@ecorp.com',
        subject: 'Looking for an update on the malware presentation',
        text: 'Please send ASAP',
      })
      expect(testHandler.inbox).toHaveLength(1)
    })
  })
})
