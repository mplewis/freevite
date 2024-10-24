import type {
  FindEditResponseQuery,
  FindEditResponseQueryVariables,
} from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Typ from '../Typ/Typ'

export const QUERY = gql`
  query FindEditResponseQuery($editToken: String!) {
    response: responseByEditToken(editToken: $editToken) {
      event {
        title
        slug
      }
      name
      headCount
      comment
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindEditResponseQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  response,
}: CellSuccessProps<FindEditResponseQuery, FindEditResponseQueryVariables>) => {
  const { event } = response
  return (
    <>
      <Typ x="pageTitle">RSVP confirmed!</Typ>
      <Typ x="p">
        We have notified the event organizer that you will be attending:
      </Typ>

      <table className="table is-fullwidth is-hoverable is-bordered is-narrow">
        <thead>
          <tr>
            <th>Name</th>
            <th>Guests</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{response.name}</td>
            <td>{response.headCount}</td>
            <td>{response.comment || <em>No comment submitted</em>}</td>
          </tr>
        </tbody>
      </table>

      <Typ x="p">
        <a
          className="button is-primary has-text-weight-semibold mb-3"
          href={`/event/${event.slug}`}
        >
          View event details: {event.title}
        </a>
      </Typ>
      <Typ x="p">
        Need to change your RSVP details? Just reply to the email we sent you
        and we&apos;ll update your response.
      </Typ>
      <Typ x="p">Thanks for using Freevite!</Typ>
    </>
  )
}
