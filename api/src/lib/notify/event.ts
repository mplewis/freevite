import { Event } from 'types/graphql'

import { SITE_HOST } from 'src/app.config'
import { notify } from 'src/lib/notify'

/**
 * Notify the configured Discord channel of the creation of a new event.
 * @param event The event that was created
 * @returns A promise which resolves when the notification is sent
 */
export async function notifyEventCreated(
  event: Pick<
    Event,
    | 'responseConfig'
    | 'description'
    | 'editToken'
    | 'location'
    | 'ownerEmail'
    | 'slug'
    | 'title'
  >
): Promise<void> {
  await notify(`New event created`, event.title, {
    email: event.ownerEmail,
    responseConfig: JSON.stringify(event.responseConfig),
    view: `https://${SITE_HOST}/event/${event.slug}`,
    edit: `https://${SITE_HOST}/edit?token=${event.editToken}`,
  })
}

/**
 * Notify the configured Discord channel when an event is updated.
 * @param event The event that was updated
 * @param diff The changes that were made to the event
 * @returns A promise which resolves when the notification is sent
 */
export async function notifyEventUpdated(
  event: Pick<Event, 'title' | 'slug' | 'editToken'>,
  diff: Record<string | number, unknown>
) {
  await notify(`Event updated`, event.title, {
    ...diff,
    view: `https://${SITE_HOST}/event/${event.slug}`,
    edit: `https://${SITE_HOST}/edit?token=${event.editToken}`,
  })
}
