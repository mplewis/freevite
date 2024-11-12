import type { Meta, StoryObj } from '@storybook/react'

import LoadingBuddy from './LoadingBuddy'

const meta: Meta<typeof LoadingBuddy> = {
  component: LoadingBuddy,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof LoadingBuddy>

/** LoadingBuddy provides friendly messages to make the loading process less tedious. */
export const Primary: Story = {
  args: {
    className: 'has-text-black',
    durationMs: 4000,
    transitionMs: 500,
  },
}
