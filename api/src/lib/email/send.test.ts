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
  "htmlContent": "Leave this email here",
  "renderer": "plain",
  "rendererOptions": {},
  "replyTo": undefined,
  "subject": "Don't delete me",
  "textContent": "Leave this email here",
  "to": [
    "darlene@fs0ciety.pizza",
  ],
}
`)
  })
})
