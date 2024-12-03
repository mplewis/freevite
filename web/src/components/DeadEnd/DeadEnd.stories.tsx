import type { Meta, StoryObj } from '@storybook/react'

import DeadEnd from './DeadEnd'

const meta: Meta<typeof DeadEnd> = {
  component: DeadEnd,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof DeadEnd>

/** DeadEnd tells users when their request can't be completed and they have to turn back. */
export const Primary: Story = {
  args: {
    title: 'Page not found',
    desc: "Sorry, we couldn't find the page you were looking for.",
    c2a: { text: 'Go home', to: '#' },
  },
}
