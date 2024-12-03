import { stripIndent } from 'common-tags'
import { PublicEvent, Response } from 'types/graphql'

import {
  prettyEndWithBetween,
  prettyStartWithUntil,
  prettyUntil,
} from 'src/lib/shared/convert/date'
import { SITE_URL } from 'src/lib/shared/shared.config'

import { sendEmail } from '../send'

/**
 * Remind a user about an upcoming event for which they RSVPed.
 * @param event The event for which the reminder is being sent
 * @param response The response to which the reminder belongs
 * @param now The current date and time
 * @returns The result of the send operation
 */
export async function sendReminder({
  event,
  response,
  now,
}: {
  event: Pick<PublicEvent, 'title' | 'start' | 'end' | 'timezone' | 'slug'>
  response: Pick<Response, 'email'>
  now: Date
}) {
  return sendEmail({
    to: response.email,
    subject: `Reminder: ${event.title} (${prettyUntil(event.start, now, false)} away)`,
    text: stripIndent`
      Hello from Freevite! You asked for a reminder about this event when you RSVPed:

      ${event.title}
      Starts at: ${prettyStartWithUntil(event.start, event.timezone, now)})
      Ends at: ${prettyEndWithBetween(event.start, event.end, event.timezone)}

      View the event here:
      ${SITE_URL}/events/${event.slug}

      Thanks for using Freevite!
    `,
  })
}