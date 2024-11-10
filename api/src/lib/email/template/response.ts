import { stripIndent } from 'common-tags'
import { Event, PublicEvent, Response } from 'types/graphql'

import { SITE_HOST } from 'src/app.config'

import { sendEmail } from '../send'

/**
 * Send a "confirm RSVP" email to the user who just responded to an event.
 * @param event The event to which the user is responding
 * @param response The response to confirm
 * @returns The result of the send operation
 */
export async function sendResponseConfirmation({
  event,
  response,
}: {
  event: Pick<PublicEvent, 'title'>
  response: Pick<Response, 'email' | 'editToken'>
}) {
  return sendEmail({
    to: response.email,
    subject: `Confirm your RSVP to ${event.title}`,
    text: stripIndent`
      Hello from Freevite! Click this link to confirm your attendance of ${event.title}:

      https://${SITE_HOST}/rsvp?token=${response.editToken}

      You must click the above link to confirm your RSVP.
      Once you do, we'll let the organizer know you are attending.

      If you did not RSVP to this event, you can ignore this email.

      To modify or delete your RSVP, just reply to this email. Thanks for using Freevite!
    `,
  })
}

/**
 * Send a notification email to the event owner when a new response is received.
 * @param event The event to which the response was sent
 * @param response The response that was received
 * @returns The result of the send operation
 */
export async function sendNewResponseReceived({
  event,
  response,
}: {
  event: Pick<Event, 'title' | 'ownerEmail' | 'editToken'>
  response: Pick<Response, 'name' | 'headCount' | 'comment'>
}) {
  return sendEmail({
    to: event.ownerEmail,
    subject:
      `New RSVP: ${response.name} (${response.headCount}) ` +
      `${response.headCount === 1 ? 'is' : 'are'} attending ${event.title}`,
    text: stripIndent`
      Hello from Freevite! ${response.name} has confirmed they are attending ${event.title}:

      Name: ${response.name}
      Guests: ${response.headCount}
      Comment: ${response.comment || '(No comment submitted)'}

      To view all responses and manage your event, visit:

      https://${SITE_HOST}/edit?token=${event.editToken}

      If you need any help, just reply to this email. Thanks for using Freevite!
    `,
  })
}
