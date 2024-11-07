import { Embed, Webhook } from '@vermaysha/discord-webhook'
import { Event, Response } from 'types/graphql'

import { CI, LOCALHOST, SITE_URL } from 'src/app.config'

import { logger } from './logger'

/** Send a notification to the configured Discord channel's webhook. */
async function notify(
  title: string,
  description: string | null,
  fields: Record<string, string | number>
): Promise<void> {
  if (CI || LOCALHOST) return

  const url = process.env.DISCORD_WEBHOOK_URL
  if (!url) {
    logger.warn(
      { title, description, fields },
      'No Discord webhook configured, cannot send notification'
    )
    return
  }

  const f = Object.entries(fields).map(([name, value]) => ({
    name,
    value: value.toString(),
    inline: true,
  }))

  let embed = new Embed().setTitle(title).setFields(f)
  if (description) embed = embed.setDescription(description)

  const hook = new Webhook(url)
  try {
    await hook.addEmbed(embed).send()
  } catch (error) {
    logger.error({ error }, 'Error sending notification')
  }
}

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
    view: `${SITE_URL}/event/${event.slug}`,
    edit: `${SITE_URL}/edit?token=${event.editToken}`,
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
    view: `${SITE_URL}/event/${event.slug}`,
    edit: `${SITE_URL}/edit?token=${event.editToken}`,
  })
}

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
