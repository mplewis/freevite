import { randomString, randomInteger } from 'remeda'
import { Event, Response } from 'types/graphql'

import { db } from './db'
import { tidyUnconfirmedEvents, tidyUnconfirmedResponses } from './tidy'

function buildEvent(overrides: Partial<Event> = {}): Omit<Event, 'responses'> {
  return {
    confirmed: false,
    createdAt: new Date().toISOString(),
    description: randomString(32),
    editToken: randomString(32),
    end: new Date().toISOString(),
    id: randomInteger(0, 2 ** 16 - 1),
    location: randomString(32),
    ownerEmail: randomString(32),
    previewToken: randomString(32),
    responseConfig: 'SHOW_ALL',
    slug: randomString(32),
    start: new Date().toISOString(),
    title: randomString(32),
    updatedAt: new Date().toISOString(),
    visible: true,
    ...overrides,
  }
}

function buildResponse(
  overrides: Partial<Response> = {}
): Omit<Response, 'event' | 'reminders'> {
  return {
    comment: randomString(32),
    confirmed: false,
    createdAt: new Date().toISOString(),
    editToken: randomString(32),
    email: randomString(32),
    eventId: randomInteger(0, 2 ** 16 - 1),
    headCount: randomInteger(0, 2 ** 16 - 1),
    id: randomInteger(0, 2 ** 16 - 1),
    name: randomString(32),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

const now = new Date('2021-01-15T12:00:00Z')
const ago1h = '2021-01-15T11:00:00Z'
const ago25h = '2021-01-14T11:00:00Z'

describe('tidyUnconfirmedEvents', () => {
  let expectedRemainingIDs: number[]

  beforeEach(async () => {
    await db.event.deleteMany()

    const confirmed = buildEvent({ confirmed: true, createdAt: ago25h })
    const fresh = buildEvent({ confirmed: false, createdAt: ago1h })
    const stale = buildEvent({ confirmed: false, createdAt: ago25h })

    await db.event.createMany({ data: [confirmed, fresh, stale] })
    expectedRemainingIDs = [confirmed.id, fresh.id]
  })

  it('tidies unconfirmed events', async () => {
    const tidiedCount = await tidyUnconfirmedEvents(now)
    expect(tidiedCount).toBe(1)

    const remaining = await db.event.findMany()
    const remainingIDs = remaining.map((e) => e.id).sort()
    expect(remainingIDs).toEqual(expectedRemainingIDs.sort())
  })
})

describe('tidyUnconfirmedResponses', () => {
  let expectedRemainingIDs: number[]

  beforeEach(async () => {
    await db.response.deleteMany()

    const event = buildEvent()
    await db.event.create({ data: event })

    const confirmed = buildResponse({
      confirmed: true,
      createdAt: ago25h,
      eventId: event.id,
    })
    const fresh = buildResponse({
      confirmed: false,
      createdAt: ago1h,
      eventId: event.id,
    })
    const stale = buildResponse({
      confirmed: false,
      createdAt: ago25h,
      eventId: event.id,
    })

    await db.response.createMany({ data: [confirmed, fresh, stale] })
    expectedRemainingIDs = [confirmed.id, fresh.id]
  })

  it('tidies unconfirmed responses', async () => {
    const tidiedCount = await tidyUnconfirmedResponses(now)
    expect(tidiedCount).toBe(1)

    const remaining = await db.response.findMany()
    const remainingIDs = remaining.map((r) => r.id).sort()
    expect(remainingIDs).toEqual(expectedRemainingIDs.sort())
  })
})
