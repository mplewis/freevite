import dayjs from './dayjs'

export const reminderDurations = {
  '1 day': dayjs.duration(1, 'day').asSeconds(),
  '1 hour': dayjs.duration(1, 'hour').asSeconds(),
  never: null,
} as const

export type ReminderDuration = keyof typeof reminderDurations
