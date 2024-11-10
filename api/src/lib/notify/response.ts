import { Event, Response } from 'types/graphql'

import { SITE_HOST } from 'src/app.config'
import { notify } from 'src/lib/notify'

/**
 * Notify the configured Discord channel when a new response is received.
 * @param event The event for which the response was received
 * @param response The response that was received
 * @returns A promise which resolves when the notification is sent
 */
export async function notifyNewResponse(
  event: Pick<Event, 'title' | 'slug'>,
  response: Pick<Response, 'name' | 'headCount' | 'comment'>
) {
  await notify(`New response to ${event.title}`, response.name, {
    headCount: response.headCount,
    comment: response.comment,
    view: `https://${SITE_HOST}/event/${event.slug}`,
  })
}
