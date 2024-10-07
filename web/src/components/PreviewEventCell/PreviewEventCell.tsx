import type {
  FindPreviewEventQuery,
  FindPreviewEventQueryVariables,
} from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import PageHead from '../PageHead/PageHead'
import ShowEvent from '../ShowEvent/ShowEvent'

export const QUERY = gql`
  query FindPreviewEventQuery($previewToken: String!) {
    event: eventByPreviewToken(previewToken: $previewToken) {
      ownerEmail
      visible
      confirmed
      slug
      title
      description
      start
      end
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Event not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindPreviewEventQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  event,
}: CellSuccessProps<FindPreviewEventQuery, FindPreviewEventQueryVariables>) => {
  /* eslint-disable jsx-a11y/anchor-is-valid */
  const thisLink = (
    <a href="" target="_blank">
      this page URL
    </a>
  )
  return (
    <>
      <PageHead
        title="Preview Event"
        desc={`Preview your "${event.title}" event before it goes live.`}
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
      <ShowEvent event={event} />
    </>
  )
}
