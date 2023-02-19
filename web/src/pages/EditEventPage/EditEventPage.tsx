import { MetaTags } from '@redwoodjs/web'

import EditEventCell from 'src/components/EditEventCell'
import { queryValue } from 'src/logic/path'

const EditEventPage = () => {
  return (
    <>
      <MetaTags title="EditEvent" description="EditEvent page" />
      <EditEventCell editToken={queryValue('token')} />
    </>
  )
}

export default EditEventPage
