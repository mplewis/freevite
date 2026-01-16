import type { DateArray } from 'ics'

/**
 * Convert a `Date` to a `DateArray` for use in an ICS file.
 * @param d The `Date` to convert
 * @returns The `DateArray` representation
 */
export function convertToDateArray(d: Date): DateArray {
  return [
    d.getUTCFullYear(),
    d.getUTCMonth() + 1,
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
  ]
}
