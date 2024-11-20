import querystring from 'querystring'

import { RECAPTCHA_SERVER_KEY } from 'src/app.config'

import { logger } from './logger'

const RECAPTCHA_ENDPOINT = 'https://www.google.com/recaptcha/api/siteverify'

/** Return true if the given captcha token was valid, false otherwise. */
export async function validateCaptcha(token: string): Promise<boolean> {
  try {
    const data = { secret: RECAPTCHA_SERVER_KEY, response: token }
    const res = await fetch(RECAPTCHA_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: querystring.stringify(data),
    })
    const json = await res.json()
    logger.debug({ json }, 'reCAPTCHA response')
    return json.success
  } catch (err) {
    logger.error({ err }, 'Failed to validate reCAPTCHA')
    return false
  }
}
