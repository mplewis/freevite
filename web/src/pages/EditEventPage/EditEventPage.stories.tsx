import type { ComponentMeta } from '@storybook/react'

import EditEventPage from './EditEventPage'

export const generated = () => {
  return <EditEventPage />
}

export default {
  title: 'Pages/EditEventPage',
  component: EditEventPage,
} as ComponentMeta<typeof EditEventPage>
