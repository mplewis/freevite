import * as crypto from 'crypto'

import { CI, SECRET_KEY } from 'src/app.config'

const SECRET_KEY_FOR_TESTING = 'secret-key-for-testing'

/** Sign string data with the app's secret key and return a URL-safe signature. */
export function sign(data: string): string {
  const key = verifySecretKey()
  const hmac = crypto.createHmac('sha256', key)
  hmac.update(data)
  return hmac.digest('base64url')
}

/** Verify the validity of signed data. */
export function verify(data: string, signature: string): boolean {
  return sign(data) === signature
}

function verifySecretKey() {
  if (CI) return SECRET_KEY_FOR_TESTING
  if (!SECRET_KEY || SECRET_KEY === '') {
    throw new Error('SECRET_KEY is required for signing/validation')
  }
  return SECRET_KEY
}
