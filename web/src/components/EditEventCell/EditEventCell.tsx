import type { CellFailureProps, CellSuccessProps } from '@redwoodjs/web'
import type { FindEditEventQuery, FindEditEventQueryVariables } from 'types/graphql'

import DeadEnd from '../DeadEnd/DeadEnd'
import EditEventForm from '../EditEventForm/EditEventForm'
import LoadingBuddy from '../LoadingBuddy/LoadingBuddy'
export const QUERY = gql`
  query FindEditEventQuery($editToken: String!) {
    event: eventByEditToken(editToken: $editToken) {
      confirmed
      description
      editToken
      end
      location
      previewToken
      responseConfig
      slug
      start
      timezone
      title
      visible

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
    title='Event not found'
    desc={[
      "Sorry, we couldn't find the event you were looking for.",
      'Please double-check that you have the correct link.',
      'Our system automatically cleans up unconfirmed and completed events. ' +
        "If you're using an old link, your event may have expired.",
    ]}
    c2a={{ text: 'Go home', to: '/' }}
  />
)

export const Failure = ({ error }: CellFailureProps<FindEditEventQueryVariables>) => {
  console.error({ error })
  return (
    <DeadEnd
      title='Something went wrong'
      desc={[
        "Sorry, we weren't able to load your event.",
        "We've notified the engineering team who will work to resolve this issue. " +
          'Please try again later.',
      ]}
      c2a={{ text: 'Go home', to: '/' }}
    />
  )
}

export const Success = ({
  event,
}: CellSuccessProps<FindEditEventQuery, FindEditEventQueryVariables>) => {
  event = { ...event }
  delete event.__typename
  return <EditEventForm event={event} />
}
