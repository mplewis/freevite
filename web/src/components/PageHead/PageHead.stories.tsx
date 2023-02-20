// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof PageHead> = (args) => {
//   return <PageHead {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import PageHead from './PageHead'

export const generated = () => {
  return <PageHead />
}

export default {
  title: 'Components/PageHead',
  component: PageHead,
} as ComponentMeta<typeof PageHead>
