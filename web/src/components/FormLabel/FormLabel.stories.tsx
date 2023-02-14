// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof FormLabel> = (args) => {
//   return <FormLabel {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import FormLabel from './FormLabel'

export const generated = () => {
  return <FormLabel />
}

export default {
  title: 'Components/FormLabel',
  component: FormLabel,
} as ComponentMeta<typeof FormLabel>
