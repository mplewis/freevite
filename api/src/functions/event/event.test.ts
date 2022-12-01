import { parseDuration } from './event'

describe('parseDuration', () => {
  it('parses durations as expected', () => {
    expect(parseDuration('7d3h5m4s')).toEqual({
      days: 7,
      hours: 3,
      minutes: 5,
      seconds: 4,
    })
    expect(parseDuration('2 weeks 3 days')).toEqual({
      weeks: 2,
      days: 3,
    })
  })
})
