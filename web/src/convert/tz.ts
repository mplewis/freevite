/**
 * Convert a named timezone to its UTC offset in minutes.
 * See: https://stackoverflow.com/a/64262840/254187
 */
export function tzToOffsetMins(timeZone: string): number {
  const timeZoneName = Intl.DateTimeFormat('ia', {
    timeZoneName: 'short',
    timeZone,
  })
    .formatToParts()
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
