import { Embed } from '@vermaysha/discord-webhook'

import { InMemoryMailHandler } from '@redwoodjs/mailer-handler-in-memory'

import { mailer } from '../backend/mailer'
import { setDiscordSendImpl } from '../backend/notification/discord'

const testHandler = mailer.getTestHandler() as InMemoryMailHandler

const mockEmail = {
  clear: testHandler.clearInbox.bind(testHandler),
  last() {
    const { inbox } = testHandler
    if (inbox.length > 1)
      throw new Error(`Expected 0 or 1 emails, got ${inbox.length}`)
    return inbox[0] ?? null
  },
}

class DiscordInbox {
  private inbox: Embed[] = []

  async send(embed: Embed) {
    this.inbox.push(embed)
  }

  clear() {
    this.inbox = []
  }

  last() {
    if (this.inbox.length > 1)
      throw new Error(`Expected 0 or 1 messages, got ${this.inbox.length}`)
    return this.inbox[0] ?? null
  }
}

export class MockNotification {
  private discordInbox = new DiscordInbox()

  constructor() {
    setDiscordSendImpl(this.discordInbox.send.bind(this.discordInbox))
    this.clear()
  }

  clear() {
    mockEmail.clear()
    this.discordInbox.clear.bind(this.discordInbox)()
  }

  last() {
    return {
      email: mockEmail.last(),
      discord: this.discordInbox.last.bind(this.discordInbox)(),
    }
  }
}
