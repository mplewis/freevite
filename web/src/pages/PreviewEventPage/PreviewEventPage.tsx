import PreviewEventCell from 'src/components/PreviewEventCell'
import { queryValue } from 'src/logic/path'

const PreviewEventPage = () => <PreviewEventCell previewToken={queryValue('token')} />

export default PreviewEventPage
