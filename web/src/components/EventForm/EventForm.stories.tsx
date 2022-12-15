// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof EventForm> = (args) => {
//   return <EventForm {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import EventForm from './EventForm'

export const generated = () => {
  return <EventForm />
}

export default {
  title: 'Components/EventForm',
  component: EventForm,
} as ComponentMeta<typeof EventForm>
