import type {
  QueryResolvers,
  MutationResolvers,
  ResponseRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'
import { generateToken } from 'src/lib/token'

export const responses: QueryResolvers['responses'] = () => {
  return db.response.findMany()
}

export const response: QueryResolvers['response'] = ({ id }) => {
  return db.response.findUnique({
    where: { id },
  })
}

export const createResponse: MutationResolvers['createResponse'] = async ({
  eventId,
  input,
}) => {
  const event = await db.event.findUnique({ where: { id: eventId } })
  if (!event) throw new Error(`Event not found: ${eventId}`)
  return db.response.create({
    data: {
      event: { connect: { id: event.id } },
      editToken: generateToken(),
      ...input,
    },
  })
}

export const updateResponse: MutationResolvers['updateResponse'] = ({
  editToken,
  input,
}) => {
  return db.response.update({ data: input, where: { editToken } })
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
