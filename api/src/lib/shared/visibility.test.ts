import { checkVisibility } from './visibility'

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

    expect(checkVisibility({ confirmed: false, visible: true })).toEqual({
      visible: false,
      reason: 'Event is not confirmed',
    })

    expect(checkVisibility({ confirmed: true, visible: false })).toEqual({
      visible: false,
      reason: 'Event is not set to visible',
    })

    expect(checkVisibility({ confirmed: true, visible: true })).toEqual({
      visible: true,
    })
  })
})
