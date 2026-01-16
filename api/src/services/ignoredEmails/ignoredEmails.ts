import { RedwoodError } from '@redwoodjs/api'
import { verify } from 'src/lib/backend/sign'
import { db } from 'src/lib/db'
import type { MutationResolvers, QueryResolvers } from 'types/graphql'

const ERROR_MSG = 'Could not validate your request'

export const ignoredEmail: QueryResolvers['ignoredEmail'] = async ({ input: { email, token } }) => {
  if (!verify(email, token)) throw new RedwoodError(ERROR_MSG)
  return db.ignoredEmail.findUnique({ where: { email } })
}

export const createIgnoredEmail: MutationResolvers['createIgnoredEmail'] = async ({
  input: { email, token },
}) => {
  if (!verify(email, token)) throw new RedwoodError(ERROR_MSG)
  const existing = await db.ignoredEmail.findUnique({ where: { email } })
  if (existing) return existing
  return db.ignoredEmail.create({ data: { email } })
}

export const deleteIgnoredEmail: MutationResolvers['deleteIgnoredEmail'] = async ({
  input: { email, token },
}) => {
  if (!verify(email, token)) throw new RedwoodError(ERROR_MSG)
  const existing = await db.ignoredEmail.findUnique({ where: { email } })
  if (!existing) return null
  return db.ignoredEmail.delete({ where: { email } })
}
