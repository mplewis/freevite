import type {
  FindEditEventQuery,
  FindEditEventQueryVariables,
} from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

export const QUERY = gql`
  query FindEditEventQuery($editToken: String!) {
    event: eventByEditToken(editToken: $editToken) {
      expiresAt
      visible
      slug
      title
      description
      start
      end
      reminders
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
  return <div>{JSON.stringify(event)}</div>
}
