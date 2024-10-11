import type { Event } from '@prisma/client'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

import { response, createResponse } from '../responses/responses'

import {
  eventBySlug,
  eventByEditToken,
  eventByPreviewToken,
  createEvent,
  updateEvent,
  deleteEvent,
} from './events'
import type { StandardScenario } from './events.scenarios'

dayjs.extend(duration)

describe('events', () => {
  scenario('returns an event by slug', async (scenario: StandardScenario) => {
    const result = await eventBySlug({ slug: scenario.event.visible.slug })
    expect(result).toEqual({
      ...scenario.event.visible,
      responses: null,
      responseSummary: null,
    })
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

  scenario(
    'updates an event and attached reminders',
    async (scenario: StandardScenario) => {
      const original = (await eventByEditToken({
        editToken: scenario.event.visible.editToken,
      })) as Event
      const resp = await createResponse({
        eventId: original.id,
        input: {
          name: 'Jane Doe',
          email: 'jane@example.com',
          headCount: 1,
          comment: "I'll be there!",
          remindPriorSec: dayjs.duration(1, 'day').asSeconds(),
        },
      })

      const remindersBefore = (await response({ id: resp.id })).reminders
      expect(remindersBefore.length).toEqual(1)
      expect(dayjs(original.start).diff(remindersBefore[0].sendAt)).toEqual(
        dayjs.duration(1, 'day').asMilliseconds()
      )

      const newStart = '2022-01-01T00:00:00Z'
      await updateEvent({
        editToken: original.editToken,
        input: { start: new Date(newStart) },
      })

      const remindersAfter = (await response({ id: resp.id })).reminders
      expect(remindersAfter.length).toEqual(1)
      expect(dayjs(newStart).diff(remindersAfter[0].sendAt)).toEqual(
        dayjs.duration(1, 'day').asMilliseconds()
      )
    }
  )

  scenario('deletes a event', async (scenario: StandardScenario) => {
    const original = (await deleteEvent({
      editToken: scenario.event.visible.editToken,
    })) as Event
    const result = await eventByEditToken({ editToken: original.editToken })
    expect(result).toBeNull()
  })
})
