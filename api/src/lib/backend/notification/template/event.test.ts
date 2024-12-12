import { send } from '..'
import { mockNotification } from '../../../test/notification'

import { notiEventCreated } from './event'

describe('with mocked notifications', () => {
  beforeAll(() => {
    mockNotification.setup()
  })

  beforeEach(() => {
    mockNotification.clear()
  })

  describe('notiEventCreated', () => {
    it('sends the expected notifications', async () => {
      await send(
        notiEventCreated({
          ownerEmail: 'owner@example.com',
          slug: 'my-event',
          title: 'My Event',
          editToken: 'some-edit-token',
          responseConfig: 'SHOW_ALL',
        })
      )
      expect(mockNotification.lastEmail()).toMatchInlineSnapshot(`
{
  "attachments": [],
  "bcc": [],
  "cc": [],
  "from": ""Freevite Test" <test@freevite.app>",
  "handler": "nodemailer",
  "handlerOptions": undefined,
  "headers": {},
  "htmlContent": null,
  "renderer": "plain",
  "rendererOptions": {},
  "replyTo": undefined,
  "subject": "Manage your event: My Event",
  "textContent": "Hello from Freevite! Click this link to manage your event details and make it public:

https://example.com/edit?token=some-edit-token

You must click the above link within 24 hours to confirm your email address.
Otherwise, we will automatically delete your event. Feel free to recreate it.

If you did not create this event, you can ignore this email and this event will be deleted.

If you need any help, just reply to this email. Thanks for using Freevite!

To unsubscribe from all Freevite emails forever, click here:
https://example.com/unsubscribe?email=owner%40example.com&token=0_gYiqCh-1ljWPRY-gFrWSZunBu8ImFO_j1ZWBp6J1g",
  "to": [
    "owner@example.com",
  ],
}
`)
      expect(mockNotification.lastDiscord()).toMatchInlineSnapshot(`
Embed {
  "description": "My Event",
  "fields": [
    {
      "inline": true,
      "name": "email",
      "value": "owner@example.com",
    },
    {
      "inline": true,
      "name": "responseConfig",
      "value": ""SHOW_ALL"",
    },
    {
      "inline": true,
      "name": "view",
      "value": "https://example.com/event/my-event",
    },
    {
      "inline": true,
      "name": "edit",
      "value": "https://example.com/edit?token=some-edit-token",
    },
  ],
  "title": "Event created",
  "type": "rich",
}
`)
    })
  })
})
