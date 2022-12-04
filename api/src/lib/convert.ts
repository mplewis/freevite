import { Alarm, DateArray, EventAttributes } from 'ics'

import { parseDurations } from './parse'
import { UserSchema } from './types'

export function convertToEvent(data: UserSchema): EventAttributes {
  let alarms: Alarm[] = []
  if (data.alarms)
    alarms = parseDurations(data.alarms).map((duration) => ({
      action: 'audio',
      trigger: { ...duration, before: true },
      description: data.title,
    }))
  return {
    ...data,
    alarms,
    startInputType: 'utc',
    startOutputType: 'utc',
    endInputType: 'utc',
    endOutputType: 'utc',
    start: convertToDateArray(data.start),
    end: convertToDateArray(data.end),
  }
}

function convertToDateArray(d: Date): DateArray {
  return [
    d.getUTCFullYear(),
    d.getUTCMonth() + 1,
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
  ]
}
