import { useParams } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import ViewEventByTokenCell from 'src/components/ViewEventByTokenCell'

const EditEventPage = () => {
  const { token } = useParams()
  return (
    <>
      <MetaTags title="EditEvent" description="EditEvent page" />

      <h1>EditEventPage</h1>
      <p>
        Find me in <code>./web/src/pages/EditEventPage/EditEventPage.tsx</code>
      </p>

      <ViewEventByTokenCell token={token} />
    </>
  )
}

export default EditEventPage
