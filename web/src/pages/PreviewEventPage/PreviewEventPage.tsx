import PageHead from 'src/components/PageHead/PageHead'
import PreviewEventCell from 'src/components/PreviewEventCell'
import { queryValue } from 'src/logic/path'

const PreviewEventPage = () => {
  return (
    <>
      <PageHead
        title="Preview Event"
        desc="Preview an event before making it public."
      />
      <PreviewEventCell previewToken={queryValue('token')} />
    </>
  )
}

export default PreviewEventPage
