import type { ComponentMeta } from '@storybook/react'

import NewEventPage from './NewEventPage'

export const generated = () => {
  return <NewEventPage />
}

export default {
  title: 'Pages/NewEventPage',
  component: NewEventPage,
} as ComponentMeta<typeof NewEventPage>
