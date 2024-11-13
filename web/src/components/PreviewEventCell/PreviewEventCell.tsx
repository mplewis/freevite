import type {
  FindPreviewEventQuery,
  FindPreviewEventQueryVariables,
  PublicEvent,
} from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import LoadingBuddy from '../LoadingBuddy/LoadingBuddy'
import PageHead from '../PageHead/PageHead'
import ShowEvent from '../ShowEvent/ShowEvent'

export const QUERY = gql`
  query FindPreviewEventQuery($previewToken: String!) {
    event: eventByPreviewToken(previewToken: $previewToken) {
      id
      slug
      title
      description
      location
      start
      end
      timezone
    }
  }
`

export const Loading = () => (
  <div>
    <LoadingBuddy />
  </div>
)

export const Empty = () => <div>Event not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindPreviewEventQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  event,
}: CellSuccessProps<FindPreviewEventQuery, FindPreviewEventQueryVariables>) => {
  const e: PublicEvent = {
    id: event.id,
    slug: event.slug,
    title: event.title,
    description: event.description,
    location: event.location,
    start: event.start,
    end: event.end,
    timezone: event.timezone,
    responseConfig: 'DISABLED',
    responses: [],
    responseSummary: {
      headCountTotal: 0,
      responseCountTotal: 0,
    },
  }

  /* eslint-disable jsx-a11y/anchor-is-valid */
  const thisLink = (
    <a href="" target="_blank">
      this page URL
    </a>
  )
  return (
    <>
      <PageHead
        title={`Preview: ${event.title}`}
        desc="Review your event details before you go live."
      />

      <p className="is-italic mb-3">
        Below is how your event will appear to the public.
        <br />
        You can send {thisLink} to friends if you want them to review your event
        details.
      </p>

      <p>
        <button className="button link" onClick={() => history.back()}>
          &laquo; Go back
        </button>
      </p>
      <hr />
      <ShowEvent event={e} preview={true} />
    </>
  )
}
