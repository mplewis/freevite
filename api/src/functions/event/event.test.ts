import {
  convertToEvent,
  parseDuration,
  parseDurations,
  UserSchema,
} from './event'

describe('parseDuration', () => {
  it('parses a duration as expected', () => {
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

describe('parseDurations', () => {
  it('parses durations as expected', () => {
    expect(parseDurations('7d3h5m4s, 2 weeks 3 days')).toEqual([
      {
        days: 7,
        hours: 3,
        minutes: 5,
        seconds: 4,
      },
      {
        weeks: 2,
        days: 3,
      },
    ])
  })
})

describe('convertToEvent', () => {
  it('converts a UserSchema to an EventAttributes', () => {
    const input = {
      title: 'My Event',
      description: 'Please come to my event!',
      start: '2022-12-01T12:00:00.000-07:00',
      end: '2022-12-01T18:00:00.000-07:00',
      alarms: '1 day, 2 hours',
    }
    expect(convertToEvent(UserSchema.parse(input))).toEqual({
      title: 'My Event',
      description: 'Please come to my event!',
      start: [2022, 12, 1, 19, 0],
      end: [2022, 12, 2, 1, 0],
      alarms: [
        {
          trigger: { days: 1, before: true },
          action: 'audio',
          description: 'My Event',
        },
        {
          trigger: { hours: 2, before: true },
          action: 'audio',
          description: 'My Event',
        },
      ],
    })
  })
})
