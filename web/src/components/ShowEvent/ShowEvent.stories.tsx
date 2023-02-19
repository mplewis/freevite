// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof ShowEvent> = (args) => {
//   return <ShowEvent {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import ShowEvent from './ShowEvent'

export const generated = () => {
  return <ShowEvent />
}

export default {
  title: 'Components/ShowEvent',
  component: ShowEvent,
} as ComponentMeta<typeof ShowEvent>
