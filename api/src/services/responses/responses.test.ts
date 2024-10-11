import type { Response } from '@prisma/client'

import {
  responses,
  response,
  createResponse,
  updateResponse,
  deleteResponse,
} from './responses'
import type { StandardScenario } from './responses.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('responses', () => {
  scenario('returns all responses', async (scenario: StandardScenario) => {
    const result = await responses()

    expect(result.length).toEqual(Object.keys(scenario.response).length)
  })

  scenario('returns a single response', async (scenario: StandardScenario) => {
    const result = await response({ id: scenario.response.one.id })

    expect(result).toEqual(scenario.response.one)
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
  })

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
})
