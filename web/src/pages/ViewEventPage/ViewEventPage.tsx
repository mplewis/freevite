import { MetaTags } from '@redwoodjs/web'

import ViewEventCell from 'src/components/ViewEventCell'

interface Props {
  slug: string
}

const ViewEventPage = ({ slug }: Props) => {
  return (
    <>
      <MetaTags title="ViewEvent" description="ViewEvent page" />

      <ViewEventCell slug={slug} />
    </>
  )
}

export default ViewEventPage
