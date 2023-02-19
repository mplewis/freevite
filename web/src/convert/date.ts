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

export const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
export const tzPretty = tz.replace(/_/g, ' ')

export function toLocal(d: string | Date): string {
  return dayjs(d).tz(tz).format('YYYY-MM-DDTHH:mm')
}

export function toUTC(d: string | Date): string {
  return dayjs.tz(d, tz).utc().toISOString()
}

export function prettyDate(d: string | Date): string {
  if (dayjs(d).year() === dayjs().year())
    return dayjs(d).tz(tz).format('ddd MMM D, h:mm A z')
  return dayjs(d).tz(tz).format('ddd MMM D, YYYY, h:mm A z')
}

export function prettyUntil(d: string | Date): string {
  return dayjs.duration(dayjs(d).diff(new Date())).humanize(true)
}

export function prettyBetween(s: string | Date, e: string | Date): string {
  return dayjs.duration(dayjs(e).diff(dayjs(s))).humanize(false)
}
