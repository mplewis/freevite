import { MetaTags } from '@redwoodjs/web'

import { SITE_URL } from 'src/app.config'
import ViewEventCell from 'src/components/ViewEventCell'

interface Props {
  slug: string
}

const desc =
  "View this event's details and add it to your calendar on Freevite, the simple event platform."

const ViewEventPage = ({ slug }: Props) => {
  return (
    <>
      <MetaTags
        title="You're invited!"
        description={desc}
        ogContentUrl={`${SITE_URL}${global.RWJS_API_URL}/ogImage?event=${slug}`}
      />
      <ViewEventCell slug={slug} />
    </>
  )
}

export default ViewEventPage
