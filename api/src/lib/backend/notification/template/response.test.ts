import { MockNotification } from '../../../test/notification'
import { send } from '..'

import { notiResponseConfirmed, notiResponseCreated, notiResponseDeleted } from './response'

const mockNotification = new MockNotification()

const event = {
  title: "Emma's Holiday Party",
  slug: 'emmas-holiday-party',
  ownerEmail: 'emma@example.com',
  editToken: 'SOME-EDIT-TOKEN',
}
const response = {
  name: 'Sherlock Holmes',
  email: 'holmes@example.com',
  editToken: 'SOME-EDIT-TOKEN',
  headCount: 2,
  comment: 'Looking forward to it!',
}

// notiResponseCreated
// notiResponseConfirmed
// notiResponseDeleted

describe('with mocked notifications', () => {
  afterEach(() => {
    mockNotification.clear()
  })

  describe('notiResponseCreated', () => {
    it('sends the expected notifications', async () => {
      await send(notiResponseCreated(event, response))
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
    "subject": "Confirm your RSVP to Emma's Holiday Party",
    "textContent": "Hello from Freevite! Click here to confirm you're attending Emma's Holiday Party:
https://example.com/rsvp?token=SOME-EDIT-TOKEN
Once you do, we'll confirm your RSVP and notify the event organizer.

To change your response or delete your RSVP, click the link above.

If you did not RSVP to this event, you can ignore this email.

To unsubscribe from all Freevite emails forever, click here:
https://example.com/unsubscribe?email=holmes%40example.com&token=gDd6UhfXCs8ipE9rs9JuUN5lwNUgSJjs6NXyZXdUgm4",
    "to": [
      "holmes@example.com",
    ],
  },
}
`)
    })
  })

  describe('notiResponseConfirmed', () => {
    it('sends the expected notifications', async () => {
      await send(notiResponseConfirmed(event, response))
      expect(mockNotification.last()).toMatchInlineSnapshot(`
{
  "discord": Embed {
    "description": "Sherlock Holmes",
    "fields": [
      {
        "inline": true,
        "name": "headCount",
        "value": "2",
      },
      {
        "inline": true,
        "name": "comment",
        "value": "Looking forward to it!",
      },
      {
        "inline": true,
        "name": "view",
        "value": "https://example.com/event/emmas-holiday-party",
      },
    ],
    "title": "New response to Emma's Holiday Party",
    "type": "rich",
  },
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
    "subject": "New RSVP: Sherlock Holmes (2) are attending Emma's Holiday Party",
    "textContent": "Hello from Freevite! Sherlock Holmes has confirmed they are attending Emma's Holiday Party:

Name: Sherlock Holmes
Guests: 2
Comment: Looking forward to it!

To view all responses and manage your event, click here:
https://example.com/edit?token=SOME-EDIT-TOKEN

Thanks for using Freevite!

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

  describe('notiResponseDeleted', () => {
    it('sends the expected notifications', async () => {
      await send(notiResponseDeleted(event, response))
      expect(mockNotification.last()).toMatchInlineSnapshot(`
{
  "discord": Embed {
    "description": "Sherlock Holmes",
    "fields": [
      {
        "inline": true,
        "name": "headCount",
        "value": "2",
      },
      {
        "inline": true,
        "name": "comment",
        "value": "Looking forward to it!",
      },
      {
        "inline": true,
        "name": "view",
        "value": "https://example.com/event/emmas-holiday-party",
      },
    ],
    "title": "Response to Emma's Holiday Party canceled",
    "type": "rich",
  },
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
    "subject": "RSVP canceled: Sherlock Holmes",
    "textContent": "Hello from Freevite! Sherlock Holmes has canceled their RSVP to Emma's Holiday Party.

Here are the details of the RSVP before it was canceled:
Name: Sherlock Holmes
Guests: 2
Comment: Looking forward to it!

To view all RSVPs and manage your event, click here:
https://example.com/edit?token=SOME-EDIT-TOKEN

Thanks for using Freevite!

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
})
