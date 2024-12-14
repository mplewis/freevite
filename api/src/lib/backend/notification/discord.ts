import { Embed, Webhook } from '@vermaysha/discord-webhook'

import { CI, LOCALHOST } from 'src/lib/shared/shared.config'

import { logger } from '../logger'

/** Send a notification to the configured Discord channel's webhook. */
export async function sendDiscord({
  title,
  description,
  fields,
}: {
  title: string
  description?: string
  fields?: Record<string, string | number>
}): Promise<void> {
  let embed = new Embed().setTitle(title)
  if (description) embed = embed.setDescription(description)
  if (fields) {
    const f = Object.entries(fields).map(([name, value]) => ({
      name,
      value: value.toString(),
      inline: true,
    }))
    embed = embed.setFields(f)
  }

  try {
    sendImpl(embed)
  } catch (error) {
    logger.error({ error }, 'Error sending notification')
  }
}

let sendImpl: (embed: Embed) => Promise<void> = sendToDiscord
/** Set the Discord send implementation. Used for testing. */
export function setDiscordSendImpl(impl: (embed: Embed) => Promise<void>) {
  sendImpl = impl
}

async function sendToDiscord(embed: Embed): Promise<void> {
  if (CI || LOCALHOST) return
  const url = process.env.DISCORD_WEBHOOK_URL
  if (!url)
    throw new Error(
      `Missing DISCORD_WEBHOOK_URL, cannot send notification: ${embed}`
    )

  const hook = new Webhook(url)
  await hook.addEmbed(embed).send()
}
