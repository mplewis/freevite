import { Event, Response } from 'types/graphql'

import { SITE_URL } from 'src/api.config'

import { notify } from '../notify'

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
    view: `${SITE_URL}/event/${event.slug}`,
  })
}

/**
 * Notify the configured Discord channel when a response is deleted.
 * @param event The event for which the response was deleted
 * @param response The response that was deleted
 * @returns A promise which resolves when the notification is sent
 */
export async function notifyResponseDeleted(
  event: Pick<Event, 'title' | 'slug'>,
  response: Pick<Response, 'name' | 'headCount' | 'comment'>
) {
  await notify(`Response deleted from ${event.title}`, response.name, {
    headCount: response.headCount,
    comment: response.comment,
    view: `${SITE_URL}/event/${event.slug}`,
  })
}
