import type { Event } from '@prisma/client'

import { createEvent, deleteEvent, eventByEditToken, eventByPreviewToken, eventBySlug, updateEvent } from './events'
import type { StandardScenario } from './events.scenarios'

// biome-ignore lint/suspicious/noExplicitAny: intentionally generic for test helper
function noMutables(event: any) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { createdAt, updatedAt, id, ...rest } = event
  return rest
}

describe('events', () => {
  scenario('returns an event by slug', async (scenario: StandardScenario) => {
    const result = await eventBySlug({ slug: scenario.event.visible.slug })
    expect(noMutables(result)).toMatchInlineSnapshot(`
      {
        "description": "String",
        "end": 2023-02-12T23:14:37.652Z,
        "location": "",
        "responseConfig": "DISABLED",
        "responseSummary": null,
        "responses": null,
        "slug": "String6210380",
        "start": 2023-02-12T23:13:37.652Z,
        "timezone": null,
        "title": "String",
      }
    `)
  })

  scenario('does not return an invisible event by slug', async (scenario: StandardScenario) => {
    const result = await eventBySlug({ slug: scenario.event.invisible.slug })
    expect(result).toBeNull()
  })

  scenario('returns an event by editToken', async (scenario: StandardScenario) => {
    const result = await eventByEditToken({
      editToken: scenario.event.visible.editToken,
    })
    expect(noMutables(result)).toMatchInlineSnapshot(`
{
  "confirmed": true,
  "description": "String",
  "editToken": "String1328327",
  "end": 2023-02-12T23:14:37.652Z,
  "location": "",
  "ownerEmail": "String",
  "previewToken": "String571517",
  "responseConfig": "DISABLED",
  "responses": [],
  "slug": "String6210380",
  "start": 2023-02-12T23:13:37.652Z,
  "timezone": null,
  "title": "String",
  "visible": true,
}
`)
  })

  scenario('returns an event by previewToken', async (scenario: StandardScenario) => {
    const result = await eventByPreviewToken({
      previewToken: scenario.event.visible.previewToken,
    })
    expect(noMutables(result)).toMatchInlineSnapshot(`
        {
          "confirmed": true,
          "description": "String",
          "editToken": "String1328327",
          "end": 2023-02-12T23:14:37.652Z,
          "location": "",
          "ownerEmail": "String",
          "previewToken": "String571517",
          "responseConfig": "DISABLED",
          "slug": "String6210380",
          "start": 2023-02-12T23:13:37.652Z,
          "timezone": null,
          "title": "String",
          "visible": true,
        }
      `)
  })

  scenario('creates a event', async () => {
    const result = await createEvent({
      input: {
        ownerEmail: 'user@example.com',
        title: 'My birthday party',
        responseConfig: 'DISABLED',
        captchaResponse: 'some-captcha-response',
      },
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
