import dayjs from 'dayjs'
import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { validate } from '@redwoodjs/api'

import { db } from 'src/lib/db'
import { generateToken } from 'src/lib/token'
import { checkVisibility } from 'src/lib/visibility'

const defaultEventParams = () => ({
  editToken: generateToken(),
  previewToken: generateToken(),
  slug: generateToken({ count: 8, prefix: 'my_event_' }),
  description:
    'Fill in your event description here.\n\nYou can use **Markdown** to style this section. Learn more at https://www.markdownguide.org.',
  start: dayjs().add(7, 'day').toISOString(),
  end: dayjs().add(7, 'day').add(1, 'hour').toISOString(),
  reminders: '1 day, 30 minutes',
})

export const eventBySlug: QueryResolvers['eventBySlug'] = async ({ slug }) => {
  const event = await db.event.findUnique({ where: { slug } })
  if (!checkVisibility(event).visible) return null
  return event
}

export const eventByEditToken: QueryResolvers['eventByEditToken'] = async ({
  editToken,
}) => {
  const event = await db.event.findUnique({ where: { editToken } })
  if (!event) return null
  if (!event.confirmed)
    await db.event.update({ where: { editToken }, data: { confirmed: true } })
  return event
}

export const eventByPreviewToken: QueryResolvers['eventByPreviewToken'] =
  async ({ previewToken }) => db.event.findUnique({ where: { previewToken } })

export const createEvent: MutationResolvers['createEvent'] = async ({
  input,
}) => {
  validate(input.ownerEmail, 'email', { email: true })
  validate(input.title, 'title', {
    custom: {
      with: () => {
        if (input.title.trim().length === 0)
          throw new Error('Title must not be blank')
      },
    },
  })
  return db.event.create({ data: { ...defaultEventParams(), ...input } })
}

export const updateEvent: MutationResolvers['updateEvent'] = ({
  editToken,
  input,
}) => {
  validate(input.end, 'end', {
    custom: {
      with: () => {
        if (!dayjs(input.end).isAfter(dayjs(input.start)))
          throw new Error('End date must be after the start date')
      },
    },
  })
  return db.event.update({ data: input, where: { editToken } })
}

export const deleteEvent: MutationResolvers['deleteEvent'] = ({ editToken }) =>
  db.event.delete({ where: { editToken } })
