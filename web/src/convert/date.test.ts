import { toLocal, toUTC } from './date'

describe('toLocal', () => {
  it('converts a date to a local representation', () => {
    const d = '2024-12-25T08:00:00Z'
    const tz = 'America/Denver'
    expect(toLocal(d, tz)).toBe('2024-12-25T01:00')
  })
})

describe('toUTC', () => {
  it('converts a date to a UTC representation', () => {
    const d = '2024-12-25T01:00'
    const tz = 'America/Denver'
    expect(toUTC(d, tz)).toBe('2024-12-25T08:00:00.000Z')
  })
})
