import type { Prisma } from '@prisma/client'
import { db } from 'api/src/lib/db'
import { generateToken } from 'api/src/lib/token'
import dayjs from 'dayjs'

// Manually seed via `yarn rw prisma db seed`
// Seeds automatically with `yarn rw prisma migrate dev` and `yarn rw prisma migrate reset`

// Note: if using PostgreSQL, using `createMany` to insert multiple records is much faster
// @see: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#createmany

const data: Prisma.EventCreateArgs['data'][] = [
  {
    editToken: generateToken(),
    previewToken: generateToken(),
    confirmed: true,
    expiresAt: dayjs().add(3, 'day').toDate(),
    visible: true,

    slug: 'my-event',
    title: 'My Event',
    description: 'Please come to my event!',
    start: dayjs().add(7, 'day').toDate(),
    end: dayjs().add(7, 'day').add(2, 'hour').toDate(),
    reminders: '1 day, 2 hours',
  },
]

export default async () => {
  try {
    Promise.all(
      data.map(async (data: Prisma.EventCreateArgs['data']) => {
        const record = await db.event.create({ data })
        console.log(record)
      })
    )
  } catch (error) {
    console.warn('Please define your seed data.')
    console.error(error)
  }
}
