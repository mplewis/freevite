import type {
  FindViewEventQuery,
  FindViewEventQueryVariables,
} from 'types/graphql'

import { CellSuccessProps, CellFailureProps, MetaTags } from '@redwoodjs/web'

import { SITE_URL } from 'src/app.config'

import ShowEvent from '../ShowEvent/ShowEvent'

export const QUERY = gql`
  query FindViewEventQuery($slug: String!) {
    event: eventBySlug(slug: $slug) {
      title
      description
      start
      end
      slug
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
      <MetaTags
        title={event.title}
        description="View this event's details and add it to your calendar on Freevite."
        ogContentUrl={`${SITE_URL}${global.RWJS_API_URL}/ogImage?event=${event.slug}`}
      />
      <ShowEvent event={event} />
    </>
  )
}
