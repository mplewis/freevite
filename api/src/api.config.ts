import { Options } from 'nodemailer/lib/smtp-transport'

function assert(name: string, value: string | undefined) {
  if (!value) throw new Error(`Missing required environment variable ${name}`)
}

// Secret key

export const SECRET_KEY = process.env.SECRET_KEY
if (!SECRET_KEY) throw new Error('SECRET_KEY is required')

// Recaptcha

export const RECAPTCHA_SERVER_KEY = process.env.RECAPTCHA_SERVER_KEY

// Email

assert('SMTP_HOST', process.env.SMTP_HOST)
assert('SMTP_USER', process.env.SMTP_USER)
assert('SMTP_PASS', process.env.SMTP_PASS)
assert('FROM_NAME', process.env.FROM_NAME)
assert('FROM_EMAIL', process.env.FROM_EMAIL)
process.env.SMTP_PORT ||= '587'
const port = parseInt(process.env.SMTP_PORT, 10)

export const MAIL_CONFIG = {
  port,
  host: process.env.SMTP_HOST,
  secure: port === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
} satisfies Options

export const MAIL_SENDER = {
  name: process.env.FROM_NAME,
  email: process.env.FROM_EMAIL,
}
