import type {
  FindPreviewEventQuery,
  FindPreviewEventQueryVariables,
} from 'types/graphql'

import { routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import { checkVisibility } from 'src/apiLib/visibility'

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
  const { visible } = checkVisibility(event)
  return (
    <>
      <h1>Event Preview</h1>
      <p className="is-italic mb-3">
        This is a preview of your event.
        <br />
        This event is currently{' '}
        <strong>{visible ? 'visible' : 'NOT visible'}</strong> to the public.
      </p>
      <p className="mb-3">
        {visible && (
          <a
            href={routes.viewEvent({ slug: event.slug })}
            className="button is-primary"
            target="_blank"
            rel="noreferrer"
          >
            View the public event page &raquo;
          </a>
        )}
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
