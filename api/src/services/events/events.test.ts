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
        token: 'String',
        expiresAt: '2022-12-15T23:57:54.112Z',
        title: 'String',
        description: 'String',
        start: '2022-12-15T23:57:54.112Z',
        end: '2022-12-15T23:57:54.112Z',
        reminders: 'String',
      },
    })

    expect(result.token).toEqual('String')
    expect(result.expiresAt).toEqual(new Date('2022-12-15T23:57:54.112Z'))
    expect(result.title).toEqual('String')
    expect(result.description).toEqual('String')
    expect(result.start).toEqual(new Date('2022-12-15T23:57:54.112Z'))
    expect(result.end).toEqual(new Date('2022-12-15T23:57:54.112Z'))
    expect(result.reminders).toEqual('String')
  })

  scenario('updates a event', async (scenario: StandardScenario) => {
    const original = (await event({ id: scenario.event.one.id })) as Event
    const result = await updateEvent({
      id: original.id,
      input: { token: 'String2' },
    })

    expect(result.token).toEqual('String2')
  })

  scenario('deletes a event', async (scenario: StandardScenario) => {
    const original = (await deleteEvent({ id: scenario.event.one.id })) as Event
    const result = await event({ id: original.id })

    expect(result).toEqual(null)
  })
})
