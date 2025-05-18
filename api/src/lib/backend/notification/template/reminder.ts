import { stripIndent } from 'common-tags'
import { PublicEvent, Response } from 'types/graphql'

import {
  prettyEndWithBetween,
  prettyStartWithUntil,
  prettyUntil,
} from 'src/lib/shared/convert/date'
import { SITE_URL } from 'src/lib/shared/shared.config'

import { Notification } from '..'

/** Notification about an upcoming event for which a user RSVPed. */
export function notiReminderDue(
  event: Pick<PublicEvent, 'title' | 'start' | 'end' | 'timezone' | 'slug'>,
  response: Pick<Response, 'email'>,
  now = new Date()
): Notification {
  return {
    user: {
      to: response.email,
      subject: `Reminder: ${event.title} (${prettyUntil(event.start, now, false)} away)`,
      text: stripIndent`
				Hello from Freevite! You asked for a reminder about this event when you RSVPed:

				${event.title}
				Starts at: ${prettyStartWithUntil(event.start, event.timezone, now)})
				Ends at: ${prettyEndWithBetween(event.start, event.end, event.timezone)}

				View the event here:
				${SITE_URL}/event/${event.slug}

				Thanks for using Freevite!
			`,
    },
  }
}
