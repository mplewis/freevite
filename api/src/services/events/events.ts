import type {
  QueryResolvers,
  MutationResolvers,
  PublicResponse,
} from 'types/graphql'

import { validate } from '@redwoodjs/api'

import { db } from 'src/lib/db'
import { sendEventDetails } from 'src/lib/email/template/event'
import { notifyEventCreated, notifyEventUpdated } from 'src/lib/notify'
import { summarize } from 'src/lib/response'
import { generateToken, alphaLower } from 'src/lib/token'
import { checkVisibility } from 'src/lib/visibility'

import dayjs from '../../lib/dayjs'

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

  const rs = await db.response.findMany({
    where: { eventId: event.id, confirmed: true },
  })
  const { responses, responseSummary } = (() => {
    const publicResponses: PublicResponse[] = rs.map((r) => ({
      name: r.name,
      comment: r.comment,
      headCount: r.headCount,
    }))

    switch (event.responseConfig) {
      case 'SHOW_ALL':
        return {
          responses: publicResponses,
          responseSummary: summarize(publicResponses),
        }
      case 'SHOW_COUNTS_ONLY':
        return { responses: null, responseSummary: summarize(publicResponses) }
      default:
        return { responses: null, responseSummary: null }
    }
  })()

  return {
    id: event.id,
    title: event.title,
    slug: event.slug,
    description: event.description,
    location: event.location,
    start: event.start,
    end: event.end,
    timezone: event.timezone,
    responseConfig: event.responseConfig,
    responses,
    responseSummary,
  }
}

export const eventByEditToken: QueryResolvers['eventByEditToken'] = async ({
  editToken,
}) => {
  const existing = await db.event.findUnique({ where: { editToken } })
  if (!existing) return null
  const wasConfirmed = existing.confirmed
  await db.event.update({ data: { confirmed: true }, where: { editToken } })
  if (!wasConfirmed) await notifyEventCreated(existing)
  return db.event.findUnique({
    where: { editToken },
    include: { responses: { where: { confirmed: true } } },
  })
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
  const oldEvent = await db.event.findUnique({
    where: { editToken },
  })
  const oldStart = oldEvent.start
  const event = await db.event.update({
    data: { ...input, confirmed: true },
    where: { editToken },
  })

  const diff: Record<string, string> = Object.entries(input).reduce(
    (acc, [key, value]) => {
      if (oldEvent[key] !== value) acc[key.toString()] = value.toString()
      return acc
    },
    {}
  )
  await notifyEventUpdated(event, diff)

  if (input.start) {
    const startDelta = dayjs(oldStart).diff(input.start)
    const reminders = await db.reminder.findMany({
      where: { response: { event: { editToken } } },
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
