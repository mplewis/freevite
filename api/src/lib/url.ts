import { S3_REGION, S3_BUCKET, S3_NAMESPACE, SITE_URL } from 'src/app.config'

/**
 * Generate a fully-qualified URL for the given path.
 * @param path The path in question
 * @returns The URL with `https://` and the hostname prefixed
 */
export function fqUrlForPath(path: string) {
  return `${SITE_URL}${path}`
}

/**
 * Build the public URL for an event's preview image.
 * @param event The event in question
 * @returns The URL to the event's public preview image
 */
export function eventPreviewImagePublicURL(eventSlug: string) {
  const k = keyFor(eventSlug)
  return `https://s3.${S3_REGION}.amazonaws.com/${S3_BUCKET}/${k}`
}

/**
 * Build the S3 bucket key for an event's preview image.
 * @param eventSlug The slug of the event in question
 * @returns The key for the event's preview image
 */
export function keyFor(eventSlug: string) {
  return `${S3_NAMESPACE}/${eventSlug}.png`
}
