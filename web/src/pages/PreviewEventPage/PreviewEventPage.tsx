import { MetaTags } from '@redwoodjs/web'

import PreviewEventCell from 'src/components/PreviewEventCell'
import { queryValue } from 'src/logic/path'

const PreviewEventPage = () => {
  return (
    <>
      <MetaTags title="PreviewEvent" description="PreviewEvent page" />
      <PreviewEventCell previewToken={queryValue('token')} />
    </>
  )
}

export default PreviewEventPage
