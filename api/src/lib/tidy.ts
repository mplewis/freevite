import dayjs from '../lib/dayjs'

import { db } from './db'
import { logger } from './logger'

const UNCONFIRMED_EXPIRY = dayjs.duration(24, 'hours')

/** Delete all events that have not been confirmed within the expiry period. */
export async function tidyUnconfirmedEvents(now = new Date()) {
  const unconfirmed = await db.event.findMany({
    where: { confirmed: false },
    select: { id: true, createdAt: true },
  })
  const expired = unconfirmed.filter(
    (event) =>
      dayjs(now).diff(dayjs(event.createdAt)) >
      UNCONFIRMED_EXPIRY.asMilliseconds()
  )
  const ids = expired.map((e) => e.id)
  logger.info(
    `DRY RUN: Will tidy ${ids.length} unconfirmed event(s) when enabled`,
    { ids }
  )
  // const { count } = await db.event.deleteMany({ where: { id: { in: ids } } })
  // logger.info(`Tidied ${count} unconfirmed event(s)`, { ids })
  // return count
}

/** Delete all responses that have not been confirmed within the expiry period. */
export async function tidyUnconfirmedResponses(now = new Date()) {
  const unconfirmed = await db.response.findMany({
    where: { confirmed: false },
    select: { id: true, createdAt: true },
  })
  const expired = unconfirmed.filter(
    (response) =>
      dayjs(now).diff(dayjs(response.createdAt)) >
      UNCONFIRMED_EXPIRY.asMilliseconds()
  )
  const ids = expired.map((r) => r.id)
  logger.info(
    `DRY RUN: Will tidy ${ids.length} unconfirmed response(s) when enabled`,
    { ids }
  )
  // const { count } = await db.response.deleteMany({ where: { id: { in: ids } } })
  // logger.info(`Tidied ${count} unconfirmed response(s)`, { ids })
  // return count
}
