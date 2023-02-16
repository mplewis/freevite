import { useLocation } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import EditEventCell from 'src/components/EditEventCell'
import { parseQueryString } from 'src/url'

const EditEventPage = () => {
  const { search } = useLocation()
  const [query] = React.useState(search)
  const queryPairs = parseQueryString(query)
  const { token } = queryPairs

  return (
    <>
      <MetaTags title="EditEvent" description="EditEvent page" />

      <h1>EditEventPage</h1>

      <EditEventCell editToken={token} />
    </>
  )
}

export default EditEventPage
