import type {
  FindPreviewEventQuery,
  FindPreviewEventQueryVariables,
} from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import ShowEvent from '../ShowEvent/ShowEvent'

export const QUERY = gql`
  query FindPreviewEventQuery($previewToken: String!) {
    event: eventByPreviewToken(previewToken: $previewToken) {
      visible
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
  return (
    <>
      <h1>Event Preview</h1>
      <p className="is-italic">
        This is a preview of your event.
        <br />
        This event is currently{' '}
        <strong>{event.visible ? 'visible' : 'NOT visible'}</strong> to the
        public.
      </p>
      <hr />
      <ShowEvent event={event} />
    </>
  )
}
