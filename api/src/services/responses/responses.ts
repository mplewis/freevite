import type {
  QueryResolvers,
  MutationResolvers,
  ResponseRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'
import {
  sendNewResponseReceived,
  sendResponseConfirmation,
} from 'src/lib/email/template'
import { generateToken } from 'src/lib/token'

import dayjs from '../../lib/dayjs'

export const responses: QueryResolvers['responses'] = () => {
  return db.response.findMany({ include: { reminders: true } })
}

export const response: QueryResolvers['response'] = ({ id }) => {
  return db.response.findUnique({ where: { id }, include: { reminders: true } })
}

export const responseByEditToken: QueryResolvers['responseByEditToken'] =
  async ({ editToken }) => {
    const resp = await db.response.findUnique({ where: { editToken } })
    if (resp.confirmed) return resp

    const updated = await db.response.update({
      where: { editToken },
      data: { confirmed: true },
      include: { event: true },
    })
    await sendNewResponseReceived({ event: updated.event, response: updated })
    return db.response.findUnique({
      where: { editToken },
      include: { reminders: true },
    })
  }

export const createResponse: MutationResolvers['createResponse'] = async ({
  eventId,
  input,
}) => {
  const event = await db.event.findUnique({ where: { id: eventId } })
  if (!event) throw new Error(`Event not found: ${eventId}`)

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

export const deleteResponse: MutationResolvers['deleteResponse'] = ({
  editToken,
}) => {
  return db.response.delete({ where: { editToken } })
}

export const Response: ResponseRelationResolvers = {
  event: (_obj, { root }) => {
    return db.response.findUnique({ where: { id: root?.id } }).event()
  },
  reminders: (_obj, { root }) => {
    return db.response.findUnique({ where: { id: root?.id } }).reminders()
  },
}
