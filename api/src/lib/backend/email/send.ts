import { MAIL_SENDER } from 'src/api.config'
import { mailer } from 'src/lib/backend/mailer'

import { db } from '../../db'
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
  const unfilteredTo = Array.isArray(p.to) ? p.to : [p.to]
  const to = await minusIgnored(unfilteredTo)
  if (to.length === 0) return

  const firstRecipient = Array.isArray(p.to) ? p.to[0] : p.to
  const text = _text.trim() + '\n\n' + unsubscribeFooter(firstRecipient)
  const { name, email } = MAIL_SENDER
  const from = `"${name}" <${email}>`
  logger.info({ from, to, subject, text }, 'Sending email')
  return mailer.send(Plain({ text }), { subject, from, to })
}

/** Filter a list of emails to remove recipients who have opted out of emails. */
async function minusIgnored(to: string[]): Promise<string[]> {
  const result = await db.ignoredEmail.findMany({
    where: { email: { in: to } },
    select: { email: true },
  })
  const ignored = result.map((x) => x.email).filter(Boolean) as string[]

  if (ignored.length > 0) {
    logger.info(
      { emailsOnIgnoreList: ignored },
      'Refusing to email user(s) on ignore list'
    )
  }

  const allowed = to.filter((email) => !ignored.includes(email))
  return allowed
}
