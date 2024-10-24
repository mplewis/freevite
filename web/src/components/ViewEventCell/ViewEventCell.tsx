import type {
  FindViewEventQuery,
  FindViewEventQueryVariables,
} from 'types/graphql'

import { CellSuccessProps, CellFailureProps, MetaTags } from '@redwoodjs/web'

import ShowEvent from '../ShowEvent/ShowEvent'

export const QUERY = gql`
  query FindViewEventQuery($slug: String!) {
    event: eventBySlug(slug: $slug) {
      id
      title
      description
      location
      start
      end
      slug
      timezone
      responseConfig
      responseSummary {
        headCountTotal
        responseCountTotal
      }
      responses {
        name
        headCount
        comment
      }
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
}: CellSuccessProps<FindViewEventQuery, FindViewEventQueryVariables>) => (
  <>
    <MetaTags title={event.title} />
    <ShowEvent event={event} />
  </>
)
