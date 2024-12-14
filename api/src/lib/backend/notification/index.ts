import { sendDiscord } from './discord'
import { sendEmail } from './email'

/** Notification to be emailed to a user. */
export type EmailNotification = {
  to: string | string[]
  subject: string
  text: string
  if?: boolean
}

/** Notification to be sent to admins via Discord. */
export type DiscordNotification = {
  title: string
  description?: string
  fields?: Record<string, string | number>
  if?: boolean
}

/** Notification to be sent to a user via email and admins via Discord. */
export type Notification = {
  admin?: DiscordNotification
  user?: EmailNotification
}

/** Send a notification to a user via email and admins via Discord. */
export async function send(n: Notification): Promise<void> {
  const promises: Promise<unknown>[] = []
  if (n.user) promises.push(sendEmail(n.user))
  if (n.admin) promises.push(sendDiscord(n.admin))
  await Promise.all(promises)
}
