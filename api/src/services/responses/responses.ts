import type {
  QueryResolvers,
  MutationResolvers,
  ResponseRelationResolvers,
  Reminder,
} from 'types/graphql'

import { RedwoodError } from '@redwoodjs/api'

import { validateCaptcha } from 'src/lib/backend/captcha'
import {
  // sendNewResponseReceived,
  sendResponseConfirmation,
  // sendResponseDeleted,
} from 'src/lib/backend/email/template/response'
import {
  notifyNewResponse,
  notifyResponseDeleted,
} from 'src/lib/backend/notify/response'
import { generateToken } from 'src/lib/backend/token'
import { db } from 'src/lib/db'
import dayjs from 'src/lib/shared/dayjs'
import { reminderDurations } from 'src/lib/shared/reminder'

export type UpdatableResponse = {
  name: string
  headCount: number
  comment: string
  remindPriorSec: number | null
}

/** Select the most appropriate choice for the reminder duration picker given a set of reminders. */
export function pickRemindPriorSec(input: {
  eventStart: Date
  reminders: Pick<Reminder, 'sendAt'>[]
}): number | null {
  const { eventStart, reminders } = input
  if (reminders.length === 0) return null

  // Sort by send-at date, soonest first, for stability
  const reminder = reminders.sort((a, b) => dayjs(a.sendAt).diff(b.sendAt))[0]
  const { sendAt } = reminder
  const dist = Math.abs(dayjs(sendAt).diff(eventStart)) / 1000

  const { duration } = Object.values(reminderDurations).reduce(
    (prev, currDuration) => {
      const diff = Math.abs(currDuration - dist)
      return diff <= prev.diff ? { diff, duration: currDuration } : prev
    },
    { diff: Infinity, duration: null }
  )
  return duration
}

export const responseByEditToken: QueryResolvers['responseByEditToken'] =
  async ({ editToken }) => {
    let resp = await db.response.findUnique({
      where: { editToken },
      include: { event: true, reminders: true },
    })

    if (!resp) throw new RedwoodError("Sorry, we couldn't find that RSVP.")

    if (!resp.confirmed) {
      const updated = await db.response.update({
        where: { editToken },
        data: { confirmed: true },
        include: { event: true },
      })
      const { event } = updated
      // FIXME: Restore this when we build granular notitfication settings
      // await sendNewResponseReceived({ event: event, response: updated })
      await notifyNewResponse(event, updated)

      resp = await db.response.findUnique({
        where: { editToken },
        include: { event: true, reminders: true },
      })
    }

    const {
      reminders,
      event: { start: eventStart },
    } = resp
    const remindPriorSec = pickRemindPriorSec({ reminders, eventStart })
    return { ...resp, remindPriorSec }
  }

export const createResponse: MutationResolvers['createResponse'] = async ({
  eventId,
  input: _input,
}) => {
  const event = await db.event.findUnique({ where: { id: eventId } })
  if (!event) throw new Error(`Event not found: ${eventId}`)

  const { captchaResponse, ...input } = _input
  const valid = await validateCaptcha(captchaResponse)
  if (!valid) {
    throw new RedwoodError(
      'Could not validate reCAPTCHA. Please refresh the page and try again.'
    )
  }

  const existingResponse = await db.response.findFirst({
    where: { eventId, email: input.email },
  })
  if (existingResponse) {
    await sendResponseConfirmation({ event, response: existingResponse })
    throw new RedwoodError(
      `You have already RSVPed to this event. ` +
        `We've resent your confirmation email to ${input.email}.`,
      { forbidResubmitForEmail: input.email }
    )
  }

  const reminders: { sendAt: Date }[] = []
  if (input.remindPriorSec) {
    const sendAt = dayjs(event.start)
      .subtract(input.remindPriorSec, 'second')
      .toDate()
    reminders.push({ sendAt })
  }
  delete input.remindPriorSec

  const response = await db.response.create({
    include: { reminders: true },
    data: {
      event: { connect: { id: event.id } },
      editToken: generateToken(),
      ...input,
      reminders: { create: reminders },
    },
  })
  await sendResponseConfirmation({ event, response })
  return response
}

export const updateResponse: MutationResolvers['updateResponse'] = ({
  editToken,
  input,
}) => {
  const { remindPriorSec, ...rest } = input

  return db.$transaction(async (tx) => {
    const response = await tx.response.update({
      data: rest,
      where: { editToken },
    })
    const event = await tx.event.findUnique({ where: { id: response.eventId } })
    if (!event) throw new Error(`Event not found: ${response.eventId}`)

    const alreadySent = await tx.reminder.findFirst({
      where: { responseId: response.id, sent: true },
    })
    if (alreadySent) return

    await tx.reminder.deleteMany({ where: { responseId: response.id } })
    if (remindPriorSec) {
      await tx.reminder.create({
        data: {
          response: { connect: { id: response.id } },
          sendAt: dayjs(event.start)
            .subtract(input.remindPriorSec, 'second')
            .toDate(),
        },
      })
    }

    return tx.response.findUnique({
      where: { editToken },
      include: { reminders: true },
    })
  })
}

export const deleteResponse: MutationResolvers['deleteResponse'] = async ({
  editToken,
}) => {
  const response = await db.response.delete({
    where: { editToken },
    include: { event: true },
  })
  const { event } = response
  // FIXME: Restore this when we build granular notitfication settings
  // await sendResponseDeleted({ response, event })
  await notifyResponseDeleted(event, response)
  return response
}

export const Response: ResponseRelationResolvers = {
  event: (_obj, { root }) => {
    return db.response.findUnique({ where: { id: root?.id } }).event()
  },
  reminders: (_obj, { root }) => {
    return db.response.findUnique({ where: { id: root?.id } }).reminders()
  },
}
