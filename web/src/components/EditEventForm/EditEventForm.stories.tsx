// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof EditEventForm> = (args) => {
//   return <EditEventForm {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import EditEventForm from './EditEventForm'

export const generated = () => {
  return <EditEventForm />
}

export default {
  title: 'Components/EditEventForm',
  component: EditEventForm,
} as ComponentMeta<typeof EditEventForm>
