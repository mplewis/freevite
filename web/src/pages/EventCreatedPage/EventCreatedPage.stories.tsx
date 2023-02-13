import type { ComponentMeta } from '@storybook/react'

import EventCreatedPage from './EventCreatedPage'

export const generated = () => {
  return <EventCreatedPage />
}

export default {
  title: 'Pages/EventCreatedPage',
  component: EventCreatedPage,
} as ComponentMeta<typeof EventCreatedPage>
