// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof Event> = (args) => {
//   return <Event {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import Event from './Event'

const desc =
  'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual…'

export const generated = () => {
  return (
    <Event
      calendar={{ month: 'JUN', day: '20', time: '10:00 am MT' }}
      title="Late September Christmas Party"
      description={desc}
    />
  )
}

export default {
  title: 'Components/Event',
  component: Event,
} as ComponentMeta<typeof Event>
