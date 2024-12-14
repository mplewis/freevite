import { send } from '..'
import { MockNotification } from '../../../test/notification'

import { notiEventConfirmed, notiEventCreated, notiEventDeleted } from './event'

const mockNotification = new MockNotification()

describe('with mocked notifications', () => {
  afterEach(() => {
    mockNotification.clear()
  })

  describe('notiEventCreated', () => {
    it('sends the expected notifications', async () => {
      await send(
        notiEventCreated({
          ownerEmail: 'emma@example.com',
          title: "Emma's Holiday Party",
          editToken: 'SOME-EDIT-TOKEN',
        })
      )
      expect(mockNotification.last()).toMatchInlineSnapshot(`
{
  "discord": null,
  "email": {
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
    "subject": "Manage your event: Emma's Holiday Party",
    "textContent": "Hello from Freevite! Click this link to manage your event details and make it public:

https://example.com/edit?token=SOME-EDIT-TOKEN

You must click the above link within 24 hours to confirm your email address.
Otherwise, we will automatically delete your event. Feel free to recreate it.

If you did not create this event, you can ignore this email and this event will be deleted.

If you need any help, just reply to this email. Thanks for using Freevite!

To unsubscribe from all Freevite emails forever, click here:
https://example.com/unsubscribe?email=emma%40example.com&token=8RHP9HXHbkVfnYJ_6H5xSWGL6_5o6Er7aeoYW5SBGNg",
    "to": [
      "emma@example.com",
    ],
  },
}
`)
    })
  })

  describe('notiEventConfirmed', () => {
    it('sends the expected notifications', async () => {
      await send(
        notiEventConfirmed({
          ownerEmail: 'emma@example.com',
          title: "Emma's Holiday Party",
          slug: 'emmas-holiday-party',
          editToken: 'SOME-EDIT-TOKEN',
        })
      )
      expect(mockNotification.last()).toMatchInlineSnapshot(`
{
  "discord": Embed {
    "description": "Emma's Holiday Party",
    "fields": [
      {
        "inline": true,
        "name": "email",
        "value": "emma@example.com",
      },
      {
        "inline": true,
        "name": "view",
        "value": "https://example.com/event/emmas-holiday-party",
      },
      {
        "inline": true,
        "name": "edit",
        "value": "https://example.com/edit?token=SOME-EDIT-TOKEN",
      },
    ],
    "title": "Event created",
    "type": "rich",
  },
  "email": null,
}
`)
    })
  })

  describe('notiEventDeleted', () => {
    it('sends the expected notifications', async () => {
      await send(
        notiEventDeleted({
          ownerEmail: 'emma@example.com',
          title: "Emma's Holiday Party",
        })
      )
      expect(mockNotification.last()).toMatchInlineSnapshot(`
{
  "discord": Embed {
    "description": "Emma's Holiday Party",
    "fields": [
      {
        "inline": true,
        "name": "email",
        "value": "emma@example.com",
      },
    ],
    "title": "Event deleted",
    "type": "rich",
  },
  "email": null,
}
`)
    })
  })
})
