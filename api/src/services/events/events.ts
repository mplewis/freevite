import dayjs from 'dayjs'
import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { validate } from '@redwoodjs/api'

import { db } from 'src/lib/db'
import { sendEventDetails } from 'src/lib/email/template'
import { generateToken, alphaLower } from 'src/lib/token'
import { checkVisibility } from 'src/lib/visibility'

const defaultEventParams = (title) => ({
  editToken: generateToken(),
  previewToken: generateToken(),
  slug: generateToken({
    count: 8,
    charset: alphaLower,
    prefix:
      title
        .replace(/[^a-z0-9-]/gi, '-')
        .replace(/-+/g, '-')
        .toLowerCase() + '-',
  }),
  description:
    'Fill in your event description here.\n\n' +
    'You can use **Markdown** to style this section. Learn more at https://www.markdownguide.org.',
  start: dayjs().add(7, 'day').toISOString(),
  end: dayjs().add(7, 'day').add(1, 'hour').toISOString(),
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
  const event = await db.event.create({
    data: { ...defaultEventParams(input.title), ...input },
  })
  await sendEventDetails(event)
  return event
}

export const updateEvent: MutationResolvers['updateEvent'] = ({
  editToken,
  input,
}) => {
  if (input.end) {
    validate(input.end, 'end', {
      custom: {
        with: () => {
          if (!dayjs(input.end).isAfter(dayjs(input.start)))
            throw new Error('End date must be after the start date')
        },
      },
    })
  }
  return db.event.update({ data: input, where: { editToken } })
}

export const deleteEvent: MutationResolvers['deleteEvent'] = ({ editToken }) =>
  db.event.delete({ where: { editToken } })
