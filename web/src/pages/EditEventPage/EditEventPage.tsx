import EditEventCell from 'src/components/EditEventCell'
import PageHead from 'src/components/PageHead/PageHead'
import { queryValue } from 'src/logic/path'

const EditEventPage = () => {
  return (
    <>
      <PageHead title="Edit Event" desc="Edit your event details." />
      <EditEventCell editToken={queryValue('token')} />
    </>
  )
}

export default EditEventPage
