import { z } from 'zod'

const DateSchema = z
  .string()
  .refine((s) => !isNaN(Date.parse(s)), { message: 'Invalid date' })
  .transform((s) => new Date(s))

export const UserSchema = z.object({
  title: z.string(),
  description: z.string(),
  start: DateSchema,
  end: DateSchema,
  alarms: z.string().optional(),
})

export type UserSchema = z.infer<typeof UserSchema>
