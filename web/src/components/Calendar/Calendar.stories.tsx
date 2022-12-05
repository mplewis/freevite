// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof Calendar> = (args) => {
//   return <Calendar {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import Calendar from './Calendar'

export const generated = () => {
  return <Calendar month="SEP" day="31" time="4-8 pm" />
}

export default {
  title: 'Components/Calendar',
  component: Calendar,
} as ComponentMeta<typeof Calendar>
