import type { Response } from '@prisma/client'
import duration from 'dayjs/plugin/duration'

import { db } from 'src/lib/db'

import dayjs from '../../lib/dayjs'

import {
  responses,
  response,
  createResponse,
  updateResponse,
  deleteResponse,
} from './responses'
import type { StandardScenario } from './responses.scenarios'

dayjs.extend(duration)

describe('responses', () => {
  scenario('returns all responses', async (scenario: StandardScenario) => {
    const result = await responses()

    expect(result.length).toEqual(Object.keys(scenario.response).length)
  })

  scenario('returns a single response', async (scenario: StandardScenario) => {
    const result = await response({ id: scenario.response.one.id })

    expect(result).toEqual({ ...scenario.response.one, reminders: [] })
  })

  scenario('creates a response', async (scenario: StandardScenario) => {
    const result = await createResponse({
      eventId: scenario.response.two.eventId,
      input: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        headCount: 1,
        comment: "I'll be there!",
      },
    })

    expect(result.eventId).toEqual(scenario.response.two.eventId)
    expect(result.email).toEqual('jane@example.com')
    expect(result.headCount).toEqual(1)
    expect(result.reminders.length).toEqual(0)
  })

  scenario(
    'creates a response with a reminder',
    async (scenario: StandardScenario) => {
      const result = await createResponse({
        eventId: scenario.response.two.eventId,
        input: {
          name: 'Jane Doe',
          email: 'jane@example.com',
          headCount: 1,
          comment: "I'll be there!",
          remindPriorSec: dayjs.duration(1, 'day').asSeconds(),
        },
      })
      const event = await db.event.findUnique({ where: { id: result.eventId } })

      expect(result.eventId).toEqual(scenario.response.two.eventId)
      expect(result.email).toEqual('jane@example.com')
      expect(result.headCount).toEqual(1)
      expect(result.reminders.length).toEqual(1)
      expect(dayjs(event.start).diff(result.reminders[0].sendAt)).toEqual(
        dayjs.duration(1, 'day').asMilliseconds()
      )
    }
  )

  scenario('updates a response', async (scenario: StandardScenario) => {
    const original = (await response({
      id: scenario.response.one.id,
    })) as Response
    const result = await updateResponse({
      editToken: original.editToken,
      input: { headCount: 42 },
    })

    expect(result.headCount).toEqual(42)
  })

  scenario('deletes a response', async (scenario: StandardScenario) => {
    const original = (await deleteResponse({
      editToken: scenario.response.one.editToken,
    })) as Response
    const result = await response({ id: original.id })

    expect(result).toEqual(null)
  })

  scenario('adds a reminder', async (scenario: StandardScenario) => {
    const original = (await response({
      id: scenario.response.one.id,
    })) as Response
    const result = await updateResponse({
      editToken: original.editToken,
      input: { remindPriorSec: dayjs.duration(1, 'day').asSeconds() },
    })
    const event = await db.event.findUnique({ where: { id: original.eventId } })

    expect(result.reminders.length).toEqual(1)
    expect(dayjs(event.start).diff(result.reminders[0].sendAt)).toEqual(
      dayjs.duration(1, 'day').asMilliseconds()
    )
  })

  scenario('deletes a reminder', async (scenario: StandardScenario) => {
    const original = (await response({
      id: scenario.response.one.id,
    })) as Response
    const result = await updateResponse({
      editToken: original.editToken,
      input: { remindPriorSec: null },
    })

    expect(result.reminders.length).toEqual(0)
  })
})
