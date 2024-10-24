import type {
  FindEditEventQuery,
  FindEditEventQueryVariables,
} from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import EditEventForm from '../EditEventForm/EditEventForm'

export const QUERY = gql`
  query FindEditEventQuery($editToken: String!) {
    event: eventByEditToken(editToken: $editToken) {
      editToken
      previewToken
      confirmed
      visible
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

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Event not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindEditEventQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  event,
}: CellSuccessProps<FindEditEventQuery, FindEditEventQueryVariables>) => {
  event = { ...event }
  delete event.__typename
  return <EditEventForm event={event} />
}
