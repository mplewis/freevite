import { Embed, Webhook } from '@vermaysha/discord-webhook'

import { CI, LOCALHOST } from 'src/api.config'

import { logger } from './logger'

/** Send a notification to the configured Discord channel's webhook. */
export async function notify(
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
