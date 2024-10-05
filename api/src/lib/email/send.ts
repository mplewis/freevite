import { MAIL_SENDER } from 'src/api.config'
import { CI } from 'src/app.config'
import { mailer } from 'src/lib/mailer'

import { logger } from '../logger'

import { Plain } from './plain'

interface Params {
  to: string | string[]
  subject: string
  text: string
}

/**
 * Send an email with the given content and the global transport. Noops in CI.
 * @param params The email parameters
 * @returns The result of the send operation
 */
export async function sendEmail({ subject, text, ...p }: Params) {
  if (CI) return
  const { name, email } = MAIL_SENDER
  const from = `"${name}" <${email}>`
  const to = Array.isArray(p.to) ? p.to : [p.to]
  logger.info({ from, to, subject, text }, 'Sending email')
  return mailer.send(Plain({ text }), { subject, from, to })
}
