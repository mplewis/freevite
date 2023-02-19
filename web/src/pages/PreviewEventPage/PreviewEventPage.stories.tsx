import type { ComponentMeta } from '@storybook/react'

import PreviewEventPage from './PreviewEventPage'

export const generated = () => {
  return <PreviewEventPage />
}

export default {
  title: 'Pages/PreviewEventPage',
  component: PreviewEventPage,
} as ComponentMeta<typeof PreviewEventPage>
