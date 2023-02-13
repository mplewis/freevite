import { useLocation } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const EventCreatedPage = () => {
  const { search } = useLocation()
  const [query] = React.useState(search)
  const queryPairs = parseQueryString(query)
  const { title, email } = queryPairs

  return (
    <>
      <MetaTags title="EventCreated" description="EventCreated page" />

      <h1>Event Created</h1>
      <p>
        We&apos;ve created your event <strong>{title}</strong>. Please click the
        confirmation link in your <code>{email}</code> inbox to confirm your
        address and finish filling out your event details.
      </p>
    </>
  )
}

export default EventCreatedPage

function parseQueryString(q: string): Record<string, string> {
  const query = q.replace(/^\?/, '')
  const pairs = query.split('&')
  const result: Record<string, string> = {}
  for (const pair of pairs) {
    const [key, value] = pair.split('=')
    result[key] = decodeURIComponent(value)
  }
  return result
}
