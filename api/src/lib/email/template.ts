import { stripIndent } from 'common-tags'

import { SITE_HOST } from 'src/app.config'

import { sendEmail } from './send'

interface Event {
  ownerEmail: string
  title: string
  editToken: string
}

export async function sendEventDetails(event: Event) {
  return sendEmail({
    to: event.ownerEmail,
    subject: `Manage your event: ${event.title}`,
    text: stripIndent`
			Hello from Freevite! Click this link to manage your event details and make it public:

			https://${SITE_HOST}/edit?token=${event.editToken}

			You must click the above link within 24 hours to confirm your email address.
			Otherwise, we will automatically delete your event. Feel free to recreate it.

			If you did not create this event, you can ignore this email and this event will be deleted.

			If you need any help, just reply to this email. Thanks for using Freevite!
		`,
  })
}
