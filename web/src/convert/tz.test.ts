import { tzToOffsetMins } from './tz'

describe('tzToOffsetMins', () => {
  it('converts timezones to the expected offsets', () => {
    expect(tzToOffsetMins('US/Eastern')).toBe(240)
    expect(tzToOffsetMins('Atlantic/Reykjavik')).toBe(0)
    expect(tzToOffsetMins('Asia/Tokyo')).toBe(-540)
  })
})
