import type { FindEvents } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Events from 'src/components/Event/Events'

export const QUERY = gql`
  query FindEvents {
    events {
      id
      createdAt
      updatedAt
      token
      confirmed
      expiresAt
      visible
      title
      description
      start
      end
      reminders
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No events yet. '}
      <Link
        to={routes.newEvent()}
        className="rw-link"
      >
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ events }: CellSuccessProps<FindEvents>) => {
  return <Events events={events} />
}
