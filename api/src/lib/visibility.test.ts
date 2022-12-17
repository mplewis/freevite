import { checkVisibility } from './visibility'

const now = new Date().getTime()
const oneDay = 1000 * 60 * 60 * 24
const future = new Date(now + oneDay)
const past = new Date(now - oneDay)

describe('checkVisibility', () => {
  it('works as expected', () => {
    expect(checkVisibility(undefined)).toEqual({
      visible: false,
      reason: 'Event is not present',
    })
    expect(checkVisibility(null)).toEqual({
      visible: false,
      reason: 'Event is not present',
    })

    expect(
      checkVisibility({ confirmed: false, expiresAt: future, visible: true })
    ).toEqual({ visible: false, reason: 'Event is not confirmed' })

    expect(
      checkVisibility({ confirmed: true, expiresAt: past, visible: true })
    ).toEqual({ visible: false, reason: 'Event is expired' })

    expect(
      checkVisibility({ confirmed: true, expiresAt: future, visible: false })
    ).toEqual({ visible: false, reason: 'Event is not set to visible' })

    expect(
      checkVisibility({ confirmed: true, expiresAt: future, visible: true })
    ).toEqual({ visible: true })
  })
})
