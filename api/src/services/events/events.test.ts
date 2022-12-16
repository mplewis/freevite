import type { Event } from '@prisma/client'

import { events, event, createEvent, updateEvent, deleteEvent } from './events'
import type { StandardScenario } from './events.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('events', () => {
  scenario('returns all events', async (scenario: StandardScenario) => {
    const result = await events()

    expect(result.length).toEqual(Object.keys(scenario.event).length)
  })

  scenario('returns a single event', async (scenario: StandardScenario) => {
    const result = await event({ id: scenario.event.one.id })

    expect(result).toEqual(scenario.event.one)
  })

  scenario('creates a event', async () => {
    const result = await createEvent({
      input: {
        token: 'String4965646',
        expiresAt: '2022-12-16T23:11:00.415Z',
        slug: 'String7145003',
        title: 'String',
        description: 'String',
        start: '2022-12-16T23:11:00.415Z',
        end: '2022-12-16T23:11:00.415Z',
        reminders: 'String',
      },
    })

    expect(result.token).toEqual('String4965646')
    expect(result.expiresAt).toEqual(new Date('2022-12-16T23:11:00.415Z'))
    expect(result.slug).toEqual('String7145003')
    expect(result.title).toEqual('String')
    expect(result.description).toEqual('String')
    expect(result.start).toEqual(new Date('2022-12-16T23:11:00.415Z'))
    expect(result.end).toEqual(new Date('2022-12-16T23:11:00.415Z'))
    expect(result.reminders).toEqual('String')
  })

  scenario('updates a event', async (scenario: StandardScenario) => {
    const original = (await event({ id: scenario.event.one.id })) as Event
    const result = await updateEvent({
      id: original.id,
      input: { token: 'String99785112' },
    })

    expect(result.token).toEqual('String99785112')
  })

  scenario('deletes a event', async (scenario: StandardScenario) => {
    const original = (await deleteEvent({ id: scenario.event.one.id })) as Event
    const result = await event({ id: original.id })

    expect(result).toEqual(null)
  })
})
