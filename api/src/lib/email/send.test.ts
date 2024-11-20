import { InMemoryMailHandler } from '@redwoodjs/mailer-handler-in-memory'

import { mailer } from '../mailer'

import { sendEmail } from './send'

describe('mailer', () => {
  it('sends an email', async () => {
    const testHandler = mailer.getTestHandler() as InMemoryMailHandler
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
})
