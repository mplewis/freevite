import { Embed } from '@vermaysha/discord-webhook'

import { InMemoryMailHandler } from '@redwoodjs/mailer-handler-in-memory'

import { mailer } from '../backend/mailer'
import { setDiscordSendImpl } from '../backend/notification/discord'

const testHandler = mailer.getTestHandler() as InMemoryMailHandler

export const mockEmail = {
  clear: testHandler.clearInbox,
  lastMessage() {
    const { inbox } = testHandler
    if (inbox.length > 1)
      throw new Error(`Expected 0 or 1 emails, got ${inbox.length}`)
    return inbox[0] ?? null
  },
}

let discordInbox: Embed[] = []

export const mockDiscord = {
  setup() {
    setDiscordSendImpl(async (embed) => {
      discordInbox.push(embed)
    })
  },
  clear() {
    discordInbox = []
  },
  lastMessage() {
    if (discordInbox.length > 1)
      throw new Error(`Expected 0 or 1 messages, got ${discordInbox.length}`)
    return discordInbox[0] ?? null
  },
}

export const mockNotification = {
  setup() {
    mockDiscord.setup()
  },
  clear() {
    mockEmail.clear()
    mockDiscord.clear()
  },
  lastEmail() {
    return mockEmail.lastMessage()
  },
  lastDiscord() {
    return mockDiscord.lastMessage()
  },
}
