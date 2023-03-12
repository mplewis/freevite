import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Event } from 'types/graphql'

import { renderEventPreview } from 'src/functions/ogImage/ogImage'

const S3_REGION = process.env.S3_REGION
const S3_BUCKET = process.env.S3_BUCKET
const S3_NAMESPACE = process.env.S3_NAMESPACE

/**
 * Generate and upload a public preview image for the given event.
 * @param event The event for which to update the public preview image
 */
export async function updateEventPreviewImage(event: Event) {
  const screenshot = await renderEventPreview(event)
  const client = new S3Client({ region: S3_REGION })
  await client.send(
    new PutObjectCommand({
      ACL: 'public-read',
      Bucket: S3_BUCKET,
      Key: key(event),
      Body: screenshot,
    })
  )
}

function key(event: Event) {
  return `${S3_NAMESPACE}/${event.slug}.png`
}

/**
 * Build the public URL for an event's preview image.
 * @param event The event in question
 * @returns The URL to the event's public preview image
 */
export function eventPreviewImagePublicURL(event: Event) {
  return `https://s3.${S3_REGION}.amazonaws.com/${S3_BUCKET}/${key(event)}`
}
