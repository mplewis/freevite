// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof EventDetails> = (args) => {
//   return <EventDetails {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import EventDetails from './EventDetails'

const event = {
  id: 1,
  createdAt: '2021-12-19T23:17:51.355Z',
  updatedAt: '2021-12-19T23:17:51.355Z',
  token: 'n99XGgaIgAkx1okglvhNEPwnESmbs416',
  confirmed: true,
  expiresAt: '2022-12-19T23:17:51.355Z',
  visible: true,
  slug: 'my-event',
  title: 'My Event',
  description: 'Please come to my event!',
  start: '2022-12-23T23:17:51.356Z',
  end: '2022-12-24T01:17:51.356Z',
  reminders: '1 day, 2 hours',
}

export const generated = () => {
  return <EventDetails event={event} />
}

export default {
  title: 'Components/EventDetails',
  component: EventDetails,
} as ComponentMeta<typeof EventDetails>
