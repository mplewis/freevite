import { MAIL_SENDER } from 'src/api.config'
import { mailer } from 'src/lib/mailer'

import { logger } from '../logger'

import { Plain } from './plain'
import { unsubscribeFooter } from './unsubscribe'

interface Params {
  to: string | string[]
  subject: string
  text: string
}

/**
 * Send an email with the given content using the global RedwoodJS mailer.
 * @param params The email parameters
 * @returns The result of the send operation
 */
export async function sendEmail({ subject, text: _text, ...p }: Params) {
  const firstRecipient = Array.isArray(p.to) ? p.to[0] : p.to
  const to = Array.isArray(p.to) ? p.to : [p.to]

  const text = _text.trim() + '\n\n' + unsubscribeFooter(firstRecipient)
  const { name, email } = MAIL_SENDER
  const from = `"${name}" <${email}>`
  logger.info({ from, to, subject, text }, 'Sending email')
  return mailer.send(Plain({ text }), { subject, from, to })
}
