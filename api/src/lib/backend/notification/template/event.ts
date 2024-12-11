import { stripIndent } from 'common-tags'
import { Event } from 'types/graphql'

import { SITE_URL } from 'src/lib/shared/shared.config'

import { Notification } from '..'

/** Notification for a newly created event. */
export function notiEventCreated(
  event: Pick<
    Event,
    'ownerEmail' | 'title' | 'editToken' | 'responseConfig' | 'slug'
  >
): Notification {
  return {
    admin: {
      title: 'Event created',
      description: event.title,
      fields: {
        email: event.ownerEmail,
        responseConfig: JSON.stringify(event.responseConfig),
        view: `${SITE_URL}/event/${event.slug}`,
        edit: `${SITE_URL}/edit?token=${event.editToken}`,
      },
    },
    user: {
      to: event.ownerEmail,
      subject: `Manage your event: ${event.title}`,
      text: stripIndent`
				Hello from Freevite! Click this link to manage your event details and make it public:

				${SITE_URL}/edit?token=${event.editToken}

				You must click the above link within 24 hours to confirm your email address.
				Otherwise, we will automatically delete your event. Feel free to recreate it.

				If you did not create this event, you can ignore this email and this event will be deleted.

				If you need any help, just reply to this email. Thanks for using Freevite!
			`,
    },
  }
}

/** Notification for a deleted event. */
export function notiEventDeleted(
  event: Pick<Event, 'ownerEmail' | 'title'>
): Notification {
  return {
    admin: {
      title: `Event deleted`,
      description: event.title,
      fields: { email: event.ownerEmail },
    },
  }
}
