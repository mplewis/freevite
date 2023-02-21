import type { Event } from '@prisma/client'

import {
  eventBySlug,
  eventByEditToken,
  eventByPreviewToken,
  createEvent,
  updateEvent,
  deleteEvent,
} from './events'
import type { StandardScenario } from './events.scenarios'

describe('events', () => {
  scenario('returns an event by slug', async (scenario: StandardScenario) => {
    const result = await eventBySlug({ slug: scenario.event.visible.slug })
    expect(result).toEqual(scenario.event.visible)
  })

  scenario(
    'does not return an invisible event by slug',
    async (scenario: StandardScenario) => {
      const result = await eventBySlug({ slug: scenario.event.invisible.slug })
      expect(result).toBeNull()
    }
  )

  scenario(
    'returns an event by editToken',
    async (scenario: StandardScenario) => {
      const result = await eventByEditToken({
        editToken: scenario.event.visible.editToken,
      })
      expect(result).toEqual(scenario.event.visible)
    }
  )

  scenario(
    'returns an event by previewToken',
    async (scenario: StandardScenario) => {
      const result = await eventByPreviewToken({
        previewToken: scenario.event.visible.previewToken,
      })
      expect(result).toEqual(scenario.event.visible)
    }
  )

  scenario('creates a event', async () => {
    const result = await createEvent({
      input: { ownerEmail: 'user@example.com', title: 'My birthday party' },
    })
    expect(result.ownerEmail).toEqual('user@example.com')
    expect(result.title).toEqual('My birthday party')
  })

  scenario('updates a event', async (scenario: StandardScenario) => {
    const original = (await eventByEditToken({
      editToken: scenario.event.visible.editToken,
    })) as Event
    const result = await updateEvent({
      editToken: original.editToken,
      input: { title: 'My going-away party' },
    })
    expect(result.title).toEqual('My going-away party')
  })

  scenario('deletes a event', async (scenario: StandardScenario) => {
    const original = (await deleteEvent({
      editToken: scenario.event.visible.editToken,
    })) as Event
    const result = await eventByEditToken({ editToken: original.editToken })
    expect(result).toBeNull()
  })
})
