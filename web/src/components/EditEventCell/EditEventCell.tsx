import type {
  FindEditEventQuery,
  FindEditEventQueryVariables,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import EditEventForm from '../EditEventForm/EditEventForm'

export const QUERY = gql`
  query FindEditEventQuery($editToken: String!) {
    event: eventByEditToken(editToken: $editToken) {
      editToken
      previewToken
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
  return (
    <>
      <h1>Edit Event</h1>
      <p className="mt-3">
        <Link
          to={routes.previewEvent({ token: event.previewToken })}
          className="button"
        >
          Preview this event &raquo;
        </Link>
      </p>
      <hr />
      <EditEventForm event={event} />
    </>
  )
}
