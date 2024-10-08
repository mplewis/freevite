import { tzToOffsetMins } from './tz'

describe('tzToOffsetMins', () => {
  it('converts timezones to the expected offsets', () => {
    const summer = new Date('2024-07-01')
    const winter = new Date('2024-01-01')
    expect(tzToOffsetMins('Atlantic/Reykjavik', summer)).toBe(0)
    expect(tzToOffsetMins('Asia/Tokyo', summer)).toBe(-540)
    expect(tzToOffsetMins('US/Eastern', summer)).toBe(240)
    expect(tzToOffsetMins('US/Eastern', winter)).toBe(300)
  })
})
