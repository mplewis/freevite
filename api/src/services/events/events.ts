import dayjs from 'dayjs'
import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { validate } from '@redwoodjs/api'

import { db } from 'src/lib/db'
import { sendEventDetails } from 'src/lib/email/template'
import { summarize } from 'src/lib/response'
import { generateToken, alphaLower } from 'src/lib/token'
import { checkVisibility } from 'src/lib/visibility'

import { updateEventPreviewImage } from './preview'

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

  const r = await db.response.findMany({ where: { eventId: event.id } })
  const { responses, responseSummary } = (() => {
    switch (event.responseConfig) {
      case 'SHOW_ALL':
        return { responses: r, responseSummary: summarize(r) }
      case 'SHOW_COUNTS_ONLY':
        return { responses: null, responseSummary: summarize(r) }
      default:
        return { responses: null, responseSummary: null }
    }
  })()

  return { ...event, responses, responseSummary }
}

export const eventByEditToken: QueryResolvers['eventByEditToken'] = async ({
  editToken,
}) => db.event.findUnique({ where: { editToken } })

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

export const updateEvent: MutationResolvers['updateEvent'] = async ({
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
  const { start: oldStart } = await db.event.findUnique({
    where: { editToken },
    select: { start: true },
  })
  const event = await db.event.update({ data: input, where: { editToken } })

  if (input.start) {
    const startDelta = dayjs(oldStart).diff(input.start)
    const reminders = await db.reminder.findMany({
      where: { response: { event: { editToken } }, sent: false },
    })
    reminders.forEach(async (reminder) => {
      const sendAt = dayjs(reminder.sendAt).subtract(startDelta).toDate()
      await db.reminder.update({ where: { id: reminder.id }, data: { sendAt } })
    })
  }

  await updateEventPreviewImage(event)
  return event
}

export const deleteEvent: MutationResolvers['deleteEvent'] = ({ editToken }) =>
  db.event.delete({ where: { editToken } })
