import * as nodemailer from 'nodemailer'

import { MAIL_CONFIG, MAIL_SENDER } from 'src/api.config'
import { CI } from 'src/app.config'

interface Params {
  to: string | string[]
  subject: string
  text: string
}

const transport = nodemailer.createTransport(MAIL_CONFIG)

export async function sendEmail({ subject, text, ...p }: Params) {
  if (CI) return
  const { name, email } = MAIL_SENDER
  const from = `"${name}" <${email}>`
  const to = Array.isArray(p.to) ? p.to : [p.to]
  return transport.sendMail({ subject, text, from, to })
}
