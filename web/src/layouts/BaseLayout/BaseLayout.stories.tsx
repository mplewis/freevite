import type { ComponentMeta, ComponentStory } from '@storybook/react'

import BaseLayout from './BaseLayout'

export const generated: ComponentStory<typeof BaseLayout> = (args) => {
  return <BaseLayout {...args} />
}

export default {
  title: 'Layouts/BaseLayout',
  component: BaseLayout,
} as ComponentMeta<typeof BaseLayout>
