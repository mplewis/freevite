import { useEffect, useState } from 'react'

import type {
  Event as _Event,
  Reminder as _Reminder,
  Response as _Response,
  GetResponseQuery,
  GetResponseQueryVariables,
  UpdateResponseMutation,
  UpdateResponseMutationVariables,
  DeleteResponseMutation,
  DeleteResponseMutationVariables,
} from 'types/graphql'

import { useForm } from '@redwoodjs/forms'
import { Link, navigate, routes } from '@redwoodjs/router'
import {
  type CellSuccessProps,
  type CellFailureProps,
  useMutation,
} from '@redwoodjs/web'

import { markdownToHTML } from 'src/apiLib/markdown'
import { promptConfirm } from 'src/logic/prompt'

import CalButtons from '../CalButtons/CalButtons'
import DeleteButton from '../DeleteButton/DeleteButton'
import PageHead from '../PageHead/PageHead'
import ResponseForm from '../ResponseForm/ResponseForm'
import Typ from '../Typ/Typ'

export const QUERY = gql`
  query GetResponseQuery($editToken: String!) {
    response: responseByEditToken(editToken: $editToken) {
      editToken
      name
      headCount
      comment
      remindPriorSec
      event {
        slug
        title
        description
        start
        end
        location
        responseConfig
      }
    }
  }
`

const UPDATE_RESPONSE = gql`
  mutation UpdateResponseMutation(
    $editToken: String!
    $input: UpdateResponseInput!
  ) {
    updateResponse(editToken: $editToken, input: $input) {
      editToken
      name
      headCount
      comment
      event {
        title
        slug
        responseConfig
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
}: CellFailureProps<GetResponseQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  response,
}: CellSuccessProps<GetResponseQuery, GetResponseQueryVariables>) => {
  const { editToken, event, ...defaultValues } = response
  const { description } = event

  const formMethods = useForm({
    mode: 'onTouched',
    defaultValues,
  })
  const { reset } = formMethods

  const [save, { loading: saving, error }] = useMutation<
    UpdateResponseMutation,
    UpdateResponseMutationVariables
  >(UPDATE_RESPONSE, {
    onCompleted: () => {
      reset(defaultValues)
    },
    refetchQueries: [{ query: QUERY, variables: { editToken } }],
    awaitRefetchQueries: true,
  })

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

  const [deleting, setDeleting] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)

  const [htmlDesc, setHTMLDesc] = useState('')
  useEffect(() => {
    ;(async () => {
      const htmlDesc = await markdownToHTML(description)
      setHTMLDesc(htmlDesc)
    })()
  }, [description])

  return (
    <>
      <PageHead
        title={`Confirmed: ${event.title}`}
        desc="RSVP to events on Freevite, the simple event platform."
      />
      <Typ x="p">
        We have notified the event organizer that you will be attending{' '}
        <strong>{event.title}</strong>. Thanks for using Freevite!
      </Typ>

      <div className="mb-4">
        <Link className="button is-primary mt-3" to={`/event/${event.slug}`}>
          View details for {event.title} &raquo;
        </Link>
      </div>
      <CalButtons event={event} htmlDesc={htmlDesc} />

      <hr />
      <Typ x="subhead">Update your RSVP</Typ>
      <Typ x="p">
        Your current response is shown below. Use this form to update your
        details or cancel your RSVP.
      </Typ>

      <ResponseForm
        mode="UPDATE"
        event={event}
        loading={saving || deleting}
        formMethods={formMethods}
        error={error}
        onChange={() => setUpdateSuccess(false)}
        onSubmit={async (data) => {
          setUpdateSuccess(false)
          const input = {
            name: data.name,
            headCount: data.headCount,
            comment: data.comment,
            remindPriorSec: data.remindPriorSec,
          }
          await save({ variables: { editToken, input } })
          setUpdateSuccess(true)
        }}
      />

      {updateSuccess && (
        <Typ x="p">
          <strong className="has-text-success">
            Your RSVP was updated successfully.
          </strong>
        </Typ>
      )}

      <DeleteButton
        className="my-4"
        text="Delete my RSVP"
        disabled={deleting}
        disabledText="Deleting..."
        onClick={async () =>
          await promptConfirm({
            desc: `delete your RSVP to ${event.title}`,
            confirmWith: 'DELETE',
            action: async () => {
              setDeleting(true)
              await destroy({ variables: { editToken: response.editToken } })
              setDeleting(false)
            },
          })
        }
      />
    </>
  )
}
