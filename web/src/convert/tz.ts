/**
 * Convert a named timezone to its UTC offset in minutes.
 * See: https://stackoverflow.com/a/64262840/254187
 */
export function tzToOffsetMins(timeZone: string, when = new Date()): number {
  const timeZoneName = Intl.DateTimeFormat('ia', {
    timeZoneName: 'short',
    timeZone,
  })
    .formatToParts(when)
    .find((i) => i.type === 'timeZoneName').value
  const offset = timeZoneName.slice(3)
  if (!offset) return 0

  const matchData = offset.match(/([+-])(\d+)(?::(\d+))?/)
  if (!matchData) throw `cannot parse timezone name: ${timeZoneName}`

  const [, sign, hour, minute] = matchData
  let result = parseInt(hour) * 60
  if (sign === '+') result *= -1
  if (minute) result += parseInt(minute)

  return result
}

/** List all supported timezones. */
export function listTimeZones(when = new Date()): {
  name: string
  offsetMins: number
  offsetHrs: string
}[] {
  return Intl.supportedValuesOf('timeZone').map((name) => {
    const offsetMins = tzToOffsetMins(name, when)
    const offsetHrs = offsetMins / 60
    const sign = offsetHrs < 0 ? '-' : '+'
    const absOffsetHrs = Math.abs(offsetHrs)
    const hours = Math.floor(absOffsetHrs).toString().padStart(2, '0')
    const minutes = (Math.abs(offsetMins) % 60).toString().padStart(2, '0')
    return {
      name,
      offsetMins,
      offsetHrs: `${sign}${hours}:${minutes}`,
    }
  })
}
