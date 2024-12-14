import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Event } from 'types/graphql'

import { S3_REGION, S3_BUCKET, CI } from 'src/lib/shared/shared.config'
import { keyFor } from 'src/lib/shared/url'

import { renderEventPreview } from './ogImage'

/**
 * Generate and upload a public preview image for the given event.
 * @param event The event for which to update the public preview image
 */
export async function updateEventPreviewImage(
  event: Pick<
    Event,
    'start' | 'end' | 'title' | 'description' | 'slug' | 'timezone'
  >
) {
  if (CI) return

  const screenshot = await renderEventPreview(event)
  const client = new S3Client({
    region: S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_USER,
      secretAccessKey: process.env.S3_PASS,
    },
  })
  await client.send(
    new PutObjectCommand({
      ACL: 'public-read',
      Bucket: S3_BUCKET,
      Key: keyFor(event.slug),
      Body: screenshot,
    })
  )
}
