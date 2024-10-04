import { Metadata } from '@redwoodjs/web'

import { eventPreviewImagePublicURL } from 'src/apiLib/url'
import ViewEventCell from 'src/components/ViewEventCell'

interface Props {
  slug: string
}

const desc =
  "View this event's details and add it to your calendar on Freevite, the simple event platform."

const ViewEventPage = ({ slug }: Props) => {
  return (
    <>
      <Metadata
        title="You're invited!"
        description={desc}
        ogContentUrl={eventPreviewImagePublicURL(slug)}
      />
      <ViewEventCell slug={slug} />
    </>
  )
}

export default ViewEventPage
