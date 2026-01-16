import { SITE_URL } from 'src/lib/shared/shared.config'

import { sign } from '../sign'

/** Build the signed unsubscribe link for an email address. */
export function unsubscribeLink(email: string): string {
  const token = sign(email)
  return `${SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`
}

/** Build the unsubscribe footer for an email address. */
export function unsubscribeFooter(email: string): string {
  return (
    `To unsubscribe from all Freevite emails forever, click here:\n` + `${unsubscribeLink(email)}`
  )
}
