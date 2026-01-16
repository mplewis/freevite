import EditResponseCell from 'src/components/EditResponseCell'
import { queryValue } from 'src/logic/path'

const EditResponsePage = () => <EditResponseCell editToken={queryValue('token')} />

export default EditResponsePage
