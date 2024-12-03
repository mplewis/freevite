import type {
  FindViewEventQuery,
  FindViewEventQueryVariables,
} from 'types/graphql'

import { CellSuccessProps, CellFailureProps, Metadata } from '@redwoodjs/web'

import DeadEnd from '../DeadEnd/DeadEnd'
import LoadingBuddy from '../LoadingBuddy/LoadingBuddy'
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

export const Loading = () => (
  <div>
    <LoadingBuddy />
  </div>
)

export const Empty = () => (
  <DeadEnd
    title="Event not found"
    desc={[
      "Sorry, we couldn't find the event you were looking for.",
      'Please double-check that you have the correct link.',
      'Our system automatically cleans up unconfirmed and completed events. ' +
        "If you're using an old link, your event may have expired.",
    ]}
    c2a={{ text: 'Go home', to: '/' }}
  />
)

export const Failure = ({
  error,
}: CellFailureProps<FindViewEventQueryVariables>) => {
  console.error({ error })
  return (
    <DeadEnd
      title="Something went wrong"
      desc={[
        "Sorry, we weren't able to load your RSVP.",
        "We've notified the engineering team who will work to resolve this issue. " +
          'Please try again later.',
      ]}
      c2a={{ text: 'Go home', to: '/' }}
    />
  )
}

export const Success = ({
  event,
}: CellSuccessProps<FindViewEventQuery, FindViewEventQueryVariables>) => (
  <>
    <Metadata title={event.title} />
    <ShowEvent event={event} />
  </>
)
