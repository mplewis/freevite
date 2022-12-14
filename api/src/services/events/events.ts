import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'
import { checkVisibility } from 'src/lib/visibility'

export const events: QueryResolvers['events'] = () => {
  return db.event.findMany()
}

export const event: QueryResolvers['event'] = ({ id }) => {
  return db.event.findUnique({
    where: { id },
  })
}

export const eventBySlug: QueryResolvers['eventBySlug'] = async ({ slug }) => {
  const event = await db.event.findUnique({ where: { slug } })
  if (!checkVisibility(event).visible) return null
  return event
}

export const eventByToken: QueryResolvers['eventByToken'] = ({ token }) =>
  db.event.findUnique({ where: { token } })

export const createEvent: MutationResolvers['createEvent'] = ({ input }) => {
  return db.event.create({
    data: input,
  })
}

export const updateEvent: MutationResolvers['updateEvent'] = ({
  id,
  input,
}) => {
  return db.event.update({
    data: input,
    where: { id },
  })
}

export const deleteEvent: MutationResolvers['deleteEvent'] = ({ id }) => {
  return db.event.delete({
    where: { id },
  })
}
