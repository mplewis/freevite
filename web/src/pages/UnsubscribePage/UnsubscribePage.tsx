import IgnoredEmailCell from 'src/components/IgnoredEmailCell'
import PageHead from 'src/components/PageHead/PageHead'
import { queryValue } from 'src/logic/path'

const UnsubscribePage = () => {
  return (
    <>
      <PageHead
        title='Manage Email Preferences'
        desc='Configure how Freevite communicates with you.'
      />

      <IgnoredEmailCell input={{ email: queryValue('email'), token: queryValue('token') }} />
    </>
  )
}

export default UnsubscribePage
