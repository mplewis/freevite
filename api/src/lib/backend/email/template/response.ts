import { stripIndent } from 'common-tags'
import { Event, PublicEvent, Response } from 'types/graphql'

import { SITE_URL } from 'src/api.config'

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
      Hello from Freevite!

      Click here to confirm you're attending ${event.title}:
      ${SITE_URL}/rsvp?token=${response.editToken}
      Once you do, we'll confirm your RSVP and notify the event organizer.

      To change your response or delete your RSVP, click the link above.

      If you did not RSVP to this event, you can ignore this email.
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

      To view all responses and manage your event, click here:
      ${SITE_URL}/edit?token=${event.editToken}

      Thanks for using Freevite!
    `,
  })
}

/**
 * Send an email to the event organizer when a response is deleted.
 * @param event The event to which the response was sent
 * @param response The response that was deleted
 * @returns The result of the send operation
 */
export async function sendResponseDeleted({
  event,
  response,
}: {
  event: Pick<Event, 'title' | 'ownerEmail' | 'editToken'>
  response: Pick<Response, 'name' | 'headCount' | 'comment'>
}) {
  return sendEmail({
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
  })
}
