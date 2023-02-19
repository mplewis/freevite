import type { ComponentMeta } from '@storybook/react'

import ViewEventPage from './ViewEventPage'

export const generated = () => {
  return <ViewEventPage />
}

export default {
  title: 'Pages/ViewEventPage',
  component: ViewEventPage,
} as ComponentMeta<typeof ViewEventPage>
