import { ViewEventQuery } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

export const QUERY = gql`
  query ViewEventQuery($slug: String!) {
    event: eventBySlug(slug: $slug) {
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

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ event }: CellSuccessProps<ViewEventQuery>) => {
  return (
    <pre>
      <code>{JSON.stringify(event, null, 2)}</code>
    </pre>
  )
}
