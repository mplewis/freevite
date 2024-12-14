import advancedFormat from 'dayjs/plugin/advancedFormat'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import dayjs from '../dayjs'

dayjs.extend(advancedFormat)
dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(timezone)
dayjs.extend(utc)

export const localTZ = Intl.DateTimeFormat().resolvedOptions().timeZone
export const tzPretty = localTZ.replace(/_/g, ' ')

/**
 * Convert a date to a local representation.
 * @param d The date to convert
 * @param tz The timezone to convert to
 * @returns An ISO8601 string in the local timezone
 */
export function toLocal(d: string | Date, tz: string): string {
  return dayjs(d).tz(tz).format('YYYY-MM-DDTHH:mm')
}

/**
 * Convert a date to a UTC representation.
 * @param d The date to convert
 * @param tz The timezone to convert from
 * @returns An ISO8601 string in UTC
 */
export function toUTC(d: string | Date, tz: string): string {
  return dayjs.tz(d, tz).utc().toISOString()
}

/**
 * Format a date in the local time zone for humans.
 * @param d The date to format
 * @returns A human-readable representation of the date
 */
export function prettyDate(d: string | Date, tz: string | null): string {
  if (!tz) tz = 'UTC'
  const date = dayjs(d)
  if (date.year() === dayjs().year())
    return date.tz(tz).format('ddd MMM D, h:mm A z')
  return date.tz(tz).format('ddd MMM D, YYYY, h:mm A z')
}

/**
 * Build a verbal representation of the amount of time from now until a given date.
 * @param d The future date
 * @returns A verbal representation of the amount of time until the given date
 */
export function prettyUntil(
  d: string | Date,
  now = new Date(),
  withSuffix = true
): string {
  return dayjs.duration(dayjs(d).diff(now)).humanize(withSuffix)
}

/**
 * Build a verbal representation of the amount of time between two dates.
 * @param s The start date
 * @param e The end date
 * @returns A verbal representation of the duration between the two dates
 */
export function prettyBetween(
  s: string | Date,
  e: string | Date,
  suffix = ''
): string {
  const val = dayjs.duration(dayjs(e).diff(dayjs(s))).humanize(false)
  return [val, suffix].join(' ')
}

/**
 * Build a verbal representation of when an event starts.
 * @param start The start date of the event
 * @param tz The timezone of the event
 * @param now The current date and time
 * @returns A human-readable representation of the start date and the time until it starts
 */
export function prettyStartWithUntil(
  start: string | Date,
  tz: string | null,
  now = new Date()
): string {
  return `${prettyDate(start, tz)} (${prettyUntil(start, now)})`
}

/**
 * Build a verbal representation of when an event ends.
 * @param start The start date of the event
 * @param end The end date of the event
 * @param tz The timezone of the event
 * @returns A human-readable representation of the end date and the duration of the event
 */
export function prettyEndWithBetween(
  start: string | Date,
  end: string | Date,
  tz: string | null
): string {
  return `${prettyDate(end, tz)} (${prettyBetween(start, end, 'long')})`
}
