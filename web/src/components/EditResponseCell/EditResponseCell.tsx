import type {
  FindEditResponseQuery,
  FindEditResponseQueryVariables,
  DeleteResponseMutation,
  DeleteResponseMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import {
  type CellSuccessProps,
  type CellFailureProps,
  useMutation,
} from '@redwoodjs/web'

import { promptConfirm } from 'src/logic/prompt'

import DeleteButton from '../DeleteButton/DeleteButton'
import Typ from '../Typ/Typ'

export const QUERY = gql`
  query FindEditResponseQuery($editToken: String!) {
    response: responseByEditToken(editToken: $editToken) {
      editToken
      name
      headCount
      comment
      event {
        title
        slug
      }
    }
  }
`

const DELETE_RESPONSE = gql`
  mutation DeleteResponseMutation($editToken: String!) {
    deleteResponse(editToken: $editToken) {
      id
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

  const [destroy] = useMutation<
    DeleteResponseMutation,
    DeleteResponseMutationVariables
  >(DELETE_RESPONSE, {
    onCompleted: () => {
      alert('Your RSVP was canceled successfully.')
      navigate(routes.viewEvent({ slug: event.slug }))
    },
    onError: (error) => {
      alert(`Sorry, something went wrong:\n${error}`)
    },
  })

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

      <a className="button is-primary mb-3" href={`/event/${event.slug}`}>
        View event details: {event.title} &raquo;
      </a>

      <DeleteButton
        className="mb-3"
        text="Cancel my RSVP"
        onClick={() =>
          promptConfirm({
            desc: `cancel your RSVP to ${event.title}`,
            confirmWith: 'CANCEL',
            action: () =>
              destroy({ variables: { editToken: response.editToken } }),
          })
        }
      />

      <Typ x="p">
        Need to change your RSVP details? Just reply to the email we sent you
        and we&apos;ll update your response.
      </Typ>
      <Typ x="p">Thanks for using Freevite!</Typ>
    </>
  )
}
