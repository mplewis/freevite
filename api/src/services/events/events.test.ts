import type { Event } from '@prisma/client'

import { event, createEvent, updateEvent, deleteEvent } from './events'
import { StandardScenario } from './events.scenarios'

describe('events', () => {
  scenario('creates a event', async () => {
    const result = await createEvent({
      input: {
        ownerEmail: 'user@example.com',
        title: 'My birthday party',
      },
    })

    expect(result.ownerEmail).toEqual('user@example.com')
    expect(result.title).toEqual('My birthday party')

    expect(result.id).toBeTruthy()
    expect(result.createdAt).toBeTruthy()
    expect(result.updatedAt).toBeTruthy()
    expect(result.editToken).toBeTruthy()
    expect(result.previewToken).toBeTruthy()
    expect(result.confirmed).toEqual(false)

    expect(result.expiresAt).toBeTruthy()
    expect(result.slug).toBeTruthy()
    expect(result.title).toBeTruthy()
    expect(result.description).toBeTruthy()
    expect(result.start).toBeTruthy()
    expect(result.end).toBeTruthy()
    expect(result.reminders).toBeTruthy()
  })

  scenario('updates a event', async (scenario: StandardScenario) => {
    const original = (await event({ id: scenario.event.one.id })) as Event
    const result = await updateEvent({
      id: original.id,
      input: { title: 'My going-away party' },
    })
    expect(result.title).toEqual('My going-away party')
  })

  scenario('deletes a event', async (scenario: StandardScenario) => {
    const original = (await deleteEvent({ id: scenario.event.one.id })) as Event
    const result = await event({ id: original.id })
    expect(result).toEqual(null)
  })
})
