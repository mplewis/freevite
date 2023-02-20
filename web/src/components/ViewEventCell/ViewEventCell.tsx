import type {
  FindViewEventQuery,
  FindViewEventQueryVariables,
} from 'types/graphql'

import { CellSuccessProps, CellFailureProps, MetaTags } from '@redwoodjs/web'

import ShowEvent from '../ShowEvent/ShowEvent'

export const QUERY = gql`
  query FindViewEventQuery($slug: String!) {
    event: eventBySlug(slug: $slug) {
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
}: CellFailureProps<FindViewEventQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  event,
}: CellSuccessProps<FindViewEventQuery, FindViewEventQueryVariables>) => {
  return (
    <>
      <MetaTags title={event.title} description={event.description} />
      <ShowEvent event={event} />
    </>
  )
}
