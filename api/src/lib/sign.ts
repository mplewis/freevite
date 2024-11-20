import * as crypto from 'crypto'

import { SECRET_KEY } from 'src/app.config'

/** Sign string data with the app's secret key and return a URL-safe signature. */
export function sign(data: string): string {
  const key = verifySecretKey()
  const hmac = crypto.createHmac('sha256', key)
  hmac.update(data)
  return hmac.digest('base64url')
}

/** Verify the validity of signed data. */
export function verify(data: string, signature: string): boolean {
  console.log(`Expected: ${sign(data)}`)
  return sign(data) === signature
}

function verifySecretKey() {
  if (!SECRET_KEY || SECRET_KEY === '') {
    throw new Error('SECRET_KEY is required for signing/validation')
  }
  return SECRET_KEY
}
