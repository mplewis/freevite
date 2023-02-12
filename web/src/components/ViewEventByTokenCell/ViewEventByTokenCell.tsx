import { ViewEventByTokenQuery } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import EventDetails from '../EventDetails/EventDetails'

export const QUERY = gql`
  query ViewEventByTokenQuery($token: String!) {
    event: eventByToken(token: $token) {
      id
      token
      confirmed
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

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ event }: CellSuccessProps<ViewEventByTokenQuery>) => (
  <EventDetails event={event} />
)
