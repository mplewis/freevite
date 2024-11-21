import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { RedwoodError } from '@redwoodjs/api'

import { db } from 'src/lib/backend/db'
import { verify } from 'src/lib/backend/sign'

const ERROR_MSG = 'Could not validate your request'

export const ignoredEmail: QueryResolvers['ignoredEmail'] = async ({
  input: { email, token },
}) => {
  if (!verify(email, token)) throw new RedwoodError(ERROR_MSG)
  return db.ignoredEmail.findUnique({ where: { email } })
}

export const createIgnoredEmail: MutationResolvers['createIgnoredEmail'] =
  async ({ input: { email, token } }) => {
    if (!verify(email, token)) throw new RedwoodError(ERROR_MSG)
    const existing = await db.ignoredEmail.findUnique({ where: { email } })
    if (existing) return existing
    return db.ignoredEmail.create({ data: { email } })
  }

export const deleteIgnoredEmail: MutationResolvers['deleteIgnoredEmail'] =
  async ({ input: { email, token } }) => {
    if (!verify(email, token)) throw new RedwoodError(ERROR_MSG)
    const existing = await db.ignoredEmail.findUnique({ where: { email } })
    if (!existing) return null
    return db.ignoredEmail.delete({ where: { email } })
  }
