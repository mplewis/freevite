import {
  prettyEndWithBetween,
  prettyStartWithUntil,
  toLocal,
  toUTC,
} from './date'

const CURRENT_YEAR = 2024

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

describe('prettyStartWithUntil', () => {
  it('builds a verbal representation of when an event starts', () => {
    const start = '2024-12-25T12:00:00Z'
    const tz = 'America/Denver'
    const now = new Date('2024-12-25T08:00:00Z')
    expect(prettyStartWithUntil(start, tz, now, CURRENT_YEAR)).toBe(
      'Wed Dec 25, 5:00 AM MST (in 4 hours)'
    )
  })
})

describe('prettyEndWithBetween', () => {
  it('builds a verbal representation of when an event ends', () => {
    const start = '2024-12-25T12:00:00Z'
    const end = '2024-12-25T20:00:00Z'
    const tz = 'America/Denver'
    expect(prettyEndWithBetween(start, end, tz, CURRENT_YEAR)).toBe(
      'Wed Dec 25, 1:00 PM MST (8 hours long)'
    )
  })
})
