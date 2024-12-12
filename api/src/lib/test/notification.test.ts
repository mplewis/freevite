import { sendDiscord } from '../backend/notification/discord'

import { mockDiscord } from './notification'

describe('mock discord demo', () => {
  beforeAll(() => {
    mockDiscord.mock()
  })

  beforeEach(() => {
    mockDiscord.clear()
  })

  it('mocks discord', async () => {
    await sendDiscord({ title: 'test' })
    console.log(mockDiscord.lastMessage())
  })
})
