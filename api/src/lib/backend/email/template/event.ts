import { stripIndent } from 'common-tags'
import { Event } from 'types/graphql'

import { SITE_URL } from 'src/lib/shared/shared.config'

import { sendEmail } from '../../notification/email'

/**
 * Email the admin link for a newly-created event to its owner.
 * @param event The newly-created event
 * @returns The result of the send operation
 */
export async function sendEventDetails(
  event: Pick<Event, 'ownerEmail' | 'title' | 'editToken'>
) {
  return sendEmail({
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
  })
}
