import { db } from 'src/lib/backend/db'
import { sign } from 'src/lib/backend/sign'

import {
  createIgnoredEmail,
  deleteIgnoredEmail,
  ignoredEmail,
} from './ignoredEmails'

describe('with an email on the ignore list', () => {
  const emailExist = 'joanna@wellick.nl'
  const sigExist = sign(emailExist)
  const emailNotExist = 'tyrell@wellick.se'
  const sigNotExist = sign(emailNotExist)

  beforeEach(async () => {
    await db.ignoredEmail.create({ data: { email: emailExist } })
  })
  afterEach(async () => {
    await db.ignoredEmail.deleteMany()
  })

  describe('ignoredEmail', () => {
    it('returns an existing record', async () => {
      const record = await ignoredEmail({
        input: { email: emailExist, token: sigExist },
      })
      expect(record.email).toEqual(emailExist)
    })

    it('returns null for a non-existing record', async () => {
      const record = await ignoredEmail({
        input: { email: emailNotExist, token: sigNotExist },
      })
      expect(record).toBeNull()
    })

    it('fails for an invalid token', async () => {
      await expect(
        ignoredEmail({ input: { email: emailExist, token: 'invalid' } })
      ).rejects.toThrow('Could not validate your request')
    })
  })

  describe('createIgnoredEmail', () => {
    it('adds a new email to the ignore list', async () => {
      expect(await db.ignoredEmail.count()).toEqual(1)
      const record = await createIgnoredEmail({
        input: { email: emailNotExist, token: sigNotExist },
      })
      expect(record.email).toEqual(emailNotExist)
      expect(await db.ignoredEmail.count()).toEqual(2)
    })

    it('does not add an existing email twice', async () => {
      expect(await db.ignoredEmail.count()).toEqual(1)
      const record = await createIgnoredEmail({
        input: { email: emailExist, token: sigExist },
      })
      expect(record.email).toEqual(emailExist)
      expect(await db.ignoredEmail.count()).toEqual(1)
    })

    it('fails for an invalid token', async () => {
      await expect(
        createIgnoredEmail({
          input: { email: emailExist, token: 'invalid' },
        })
      ).rejects.toThrow('Could not validate your request')
    })
  })

  describe('deleteIgnoredEmail', () => {
    it('deletes an email from the ignore list', async () => {
      expect(await db.ignoredEmail.count()).toEqual(1)
      await deleteIgnoredEmail({
        input: { email: emailExist, token: sigExist },
      })
      expect(await db.ignoredEmail.count()).toEqual(0)
    })

    it('does nothing for an email missing from the list', async () => {
      expect(await db.ignoredEmail.count()).toEqual(1)
      await deleteIgnoredEmail({
        input: { email: emailNotExist, token: sigNotExist },
      })
      expect(await db.ignoredEmail.count()).toEqual(1)
    })

    it('fails for an invalid token', async () => {
      await expect(
        deleteIgnoredEmail({
          input: { email: emailExist, token: 'invalid' },
        })
      ).rejects.toThrow('Could not validate your request')
    })
  })
})
