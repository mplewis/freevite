// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof Typ> = (args) => {
//   return <Typ {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import Typ from './Typ'

export const generated = () => {
  return <Typ />
}

export default {
  title: 'Components/Typ',
  component: Typ,
} as ComponentMeta<typeof Typ>
