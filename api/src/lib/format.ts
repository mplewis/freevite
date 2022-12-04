import { Alarm } from 'ics'

function pluralize(n: number, unit: string): string {
  return `${n} ${unit}${n === 1 ? '' : 's'}`
}

export function alarmToString(alarm: Alarm): string {
  console.log({ alarm })
  const { trigger: t } = alarm
  const bits: string[] = []

  if (t?.weeks) bits.push(pluralize(t.weeks, 'week'))
  if (t?.days) bits.push(pluralize(t.days, 'day'))
  if (t?.hours) bits.push(pluralize(t.hours, 'hour'))
  if (t?.minutes) bits.push(pluralize(t.minutes, 'minute'))
  if (t?.seconds) bits.push(pluralize(t.seconds, 'second'))

  if (t?.before) bits.push('before')
  else bits.push('after')

  return bits.join(' ')
}
