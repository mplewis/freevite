import { stripIndent } from 'common-tags'
import { Event, Response } from 'types/graphql'

import { SITE_URL } from 'src/lib/shared/shared.config'

import { EmailNotification, Notification } from '..'

/** Notification for a newly created event. */
export function notiEventCreated(
  event: Pick<Event, 'ownerEmail' | 'title' | 'editToken'>
): Notification {
  return {
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

/** Notification for a newly confirmed event. */
export function notiEventConfirmed(
  event: Pick<Event, 'ownerEmail' | 'title' | 'slug' | 'editToken'>
): Notification {
  return {
    admin: {
      title: 'Event created',
      description: event.title,
      fields: {
        email: event.ownerEmail,
        view: `${SITE_URL}/event/${event.slug}`,
        edit: `${SITE_URL}/edit?token=${event.editToken}`,
      },
    },
  }
}

/** Notification to a change for an event. */
export function notisEventUpdated(
  event: Pick<Event, 'title' | 'slug' | 'editToken' | 'timezone'> & {
    responses: Pick<
      Response,
      'email' | 'confirmed' | 'notiEventUpdated' | 'editToken'
    >[]
  },
  diff: Record<string, [string, string]>
): Notification[] {
  const diffForAdmin = Object.entries(diff).reduce(
    (acc, [key, [before, after]]) => {
      acc[key] = `${before} → ${after}`
      return acc
    },
    {}
  ) as Record<string, string>

  return [
    {
      admin: {
        title: 'Event updated',
        description: event.title,
        fields: {
          view: `${SITE_URL}/event/${event.slug}`,
          edit: `${SITE_URL}/edit?token=${event.editToken}`,
          ...diffForAdmin,
        },
      },
    },

    event.responses.map((r) => {
      const details = Object.entries(diff)
        .reduce((acc, [key, [before, after]]) => {
          acc.push(`• ${key}: ${before} → ${after}`)
          return acc
        }, [] as string[])
        .join('\n')
      return {
        user: {
          if: r.confirmed && r.notiEventUpdated,
          to: r.email,
          subject: `Event updated: ${event.title}`,
          text: stripIndent`
            Hello from Freevite! An event you're attending, ${event.title}, has been updated.

            Here are the details that have changed:
            ${details}

            To view event details, update your RSVP, or change your email preferences, click here:
            ${SITE_URL}/rsvp?token=${r.editToken}
          `,
        },
      }
    }),
  ].flat()
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
