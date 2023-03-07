import EditEventCell from 'src/components/EditEventCell'
import { queryValue } from 'src/logic/path'

const EditEventPage = () => <EditEventCell editToken={queryValue('token')} />

export default EditEventPage
