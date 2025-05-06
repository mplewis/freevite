import dayjs from 'src/lib/shared/dayjs'

function stringify(x: any): string {
  console.log({ x, isDate: x instanceof Date })
  if (x === null || x === undefined) return '<empty>'
  if (typeof x === 'object') return JSON.stringify(x)
  return x.toString()
}

function stringifyDate(d: Date, tz: string): string {
  const df = dayjs(d).tz(tz).format('ddd MMM D, h:mm A')
  return `${df} (${tz})`
}

/** Diff an object of keys that may have changed,
 * producing a pretty-printable, human-readable diff. */
export function diffObject(
  before: Record<string, any>,
  after: Record<string, any>,
  tz: string
): Record<string, [string, string]> {
  return Object.entries(after).reduce(
    (acc, [key, b]) => {
      const a = before[key]
      if (a instanceof Date && b instanceof Date) {
        console.log({ a, b, areDates: true })
        if (a.getTime() !== b.getTime()) {
          acc[key.toString()] = [stringifyDate(a, tz), stringifyDate(b, tz)]
        }
      } else if (a !== b) {
        acc[key.toString()] = [stringify(a), stringify(b)]
      }
      return acc
    },
    {} as Record<string, [string, string]>
  )
}
