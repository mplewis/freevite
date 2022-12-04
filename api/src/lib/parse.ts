import { Alarm, DurationObject } from 'ics'

function parseUnit(
  unit: string
): 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds' {
  switch (unit) {
    case 'w':
      return 'weeks'
    case 'd':
      return 'days'
    case 'h':
      return 'hours'
    case 'm':
      return 'minutes'
    case 's':
      return 'seconds'
    default:
      throw new Error(`Invalid duration unit: ${unit}`)
  }
}

export function parseDuration(raw: string): DurationObject | null {
  const matcher = /(\d+)\s*(w|d|h|m|s)[^\d]*/g
  const rawl = raw.toLowerCase()
  const d: DurationObject = {}
  let matched = false
  let matches: string[] | null
  while ((matches = matcher.exec(rawl))) {
    matched = true
    const n = parseInt(matches[1], 10)
    const unit = parseUnit(matches[2])
    d[unit] = n
  }
  if (!matched) return null
  return d
}

export function parseDurations(raw: string): DurationObject[] {
  return raw.split(',').map(parseDuration).filter(notEmpty)
}

export function parseAlarms(raw: string, description: string): Alarm[] {
  return parseDurations(raw).map((duration) => ({
    description,
    action: 'audio',
    trigger: { ...duration, before: true },
  }))
}

// https://stackoverflow.com/a/46700791/254187
function notEmpty<T>(value: T | null | undefined): value is T {
  if (value === null || value === undefined) return false
  const _testDummy: T = value
  return true
}
