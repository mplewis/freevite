import type { Meta, StoryObj } from '@storybook/react'

import LoadingBuddy from './LoadingBuddy'

const meta: Meta<typeof LoadingBuddy> = {
  component: LoadingBuddy,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['primary', 'secondary', 'tertiary'],
    },
  },
}

export default meta

type Story = StoryObj<typeof LoadingBuddy>

/** Test docs */
export const Primary: Story = {
  args: {
    className: 'has-text-black',
  },
}
