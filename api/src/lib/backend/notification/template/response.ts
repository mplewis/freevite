import { stripIndent } from 'common-tags'
import { Event, Response } from 'types/graphql'

import { SITE_URL } from 'src/lib/shared/shared.config'

/** Notification for a newly-created response that requires confirmation. */
export function notiResponseCreated(
  event: Pick<Event, 'title' | 'slug' | 'ownerEmail' | 'editToken'>,
  response: Pick<Response, 'email' | 'editToken'>
) {
  return {
    user: {
      to: response.email,
      subject: `Confirm your RSVP to ${event.title}`,
      text: stripIndent`
				Hello from Freevite! Click here to confirm you're attending ${event.title}:
				${SITE_URL}/rsvp?token=${response.editToken}
				Once you do, we'll confirm your RSVP and notify the event organizer.

				To change your response or delete your RSVP, click the link above.

				If you did not RSVP to this event, you can ignore this email.
			`,
    },
  }
}

/** Notification for a newly-confirmed response. */
export function notiResponseConfirmed(
  event: Pick<Event, 'title' | 'ownerEmail' | 'editToken' | 'slug'>,
  response: Pick<Response, 'name' | 'headCount' | 'comment'>
) {
  return {
    admin: {
      title: `New response to ${event.title}`,
      description: response.name,
      fields: {
        headCount: response.headCount,
        comment: response.comment,
        view: `${SITE_URL}/event/${event.slug}`,
      },
    },
    user: {
      to: event.ownerEmail,
      subject:
        `New RSVP: ${response.name} (${response.headCount}) ` +
        `${response.headCount === 1 ? 'is' : 'are'} attending ${event.title}`,
      text: stripIndent`
				Hello from Freevite! ${response.name} has confirmed they are attending ${event.title}:

				Name: ${response.name}
				Guests: ${response.headCount}
				Comment: ${response.comment || '(No comment submitted)'}

				To view all responses and manage your event, click here:
				${SITE_URL}/edit?token=${event.editToken}

				Thanks for using Freevite!
			`,
    },
  }
}

/** Notification for a response that was deleted. */
export function notiResponseDeleted(
  event: Pick<Event, 'title' | 'ownerEmail' | 'editToken' | 'slug'>,
  response: Pick<Response, 'name' | 'headCount' | 'comment'>
) {
  return {
    admin: {
      title: `Response to ${event.title} canceled`,
      description: response.name,
      fields: {
        headCount: response.headCount,
        comment: response.comment,
        view: `${SITE_URL}/event/${event.slug}`,
      },
    },
    user: {
      to: event.ownerEmail,
      subject: `RSVP canceled: ${response.name}`,
      text: stripIndent`
				Hello from Freevite! ${response.name} has canceled their RSVP to ${event.title}.

				Here are the details of the RSVP before it was canceled:
				Name: ${response.name}
				Guests: ${response.headCount}
				Comment: ${response.comment || '(No comment submitted)'}

				To view all RSVPs and manage your event, click here:
				${SITE_URL}/edit?token=${event.editToken}

				Thanks for using Freevite!
			`,
    },
  }
}
