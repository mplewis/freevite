import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

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
 * @returns An ISO8601 string in the local timezone
 */
export function toLocal(d: string | Date): string {
  return dayjs(d).tz(localTZ).format('YYYY-MM-DDTHH:mm')
}

/**
 * Convert a date to a UTC representation.
 * @param d The date to convert
 * @returns An ISO8601 string in UTC
 */
export function toUTC(d: string | Date): string {
  return dayjs.tz(d, localTZ).utc().toISOString()
}

/**
 * Format a date in the local time zone for humans.
 * @param d The date to format
 * @returns A human-readable representation of the date
 */
export function prettyDate(d: string | Date): string {
  if (dayjs(d).year() === dayjs().year())
    return dayjs(d).tz(localTZ).format('ddd MMM D, h:mm A z')
  return dayjs(d).tz(localTZ).format('ddd MMM D, YYYY, h:mm A z')
}

/**
 * Build a verbal representation of the amount of time from now until a given date.
 * @param d The future date
 * @returns A verbal representation of the amount of time until the given date
 */
export function prettyUntil(d: string | Date): string {
  return dayjs.duration(dayjs(d).diff(new Date())).humanize(true)
}

/**
 * Build a verbal representation of the amount of time between two dates.
 * @param s The start date
 * @param e The end date
 * @returns A verbal representation of the duration between the two dates
 */
export function prettyBetween(s: string | Date, e: string | Date): string {
  return dayjs.duration(dayjs(e).diff(dayjs(s))).humanize(false)
}
