import { useState } from 'react'

import {
  CreateResponseMutation,
  CreateResponseMutationVariables,
  PublicEvent,
} from 'types/graphql'

import { useForm } from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'

import Typ from 'src/components/Typ/Typ'

import ResponseForm, { FormValues } from '../ResponseForm/ResponseForm'

interface Props {
  event: Pick<PublicEvent, 'id' | 'title' | 'responseConfig'>
}

const CREATE_RESPONSE = gql`
  mutation CreateResponseMutation(
    $eventId: Int!
    $input: CreateResponseInput!
  ) {
    createResponse(eventId: $eventId, input: $input) {
      email
    }
  }
`

const NewResponseForm = (props: Props) => {
  const { event } = props

  const formMethods = useForm<FormValues>({
    mode: 'onTouched',
    defaultValues: { headCount: 1 },
  })

  const [createdForEmail, setCreatedForEmail] = useState<string | null>(null)

  const [create, { loading, error }] = useMutation<
    CreateResponseMutation,
    CreateResponseMutationVariables
  >(CREATE_RESPONSE, {
    onCompleted: (data) => {
      setCreatedForEmail(data.createResponse.email)
    },
  })

  if (event.responseConfig === 'DISABLED') return null

  const Title = <Typ x="head">RSVP to {event.title}</Typ>

  if (createdForEmail) {
    return (
      <>
        {Title}
        <Typ x="p">
          A confirmation email has been sent to you at{' '}
          <strong>{createdForEmail}</strong>. Once you click the confirmation
          link in your email, we will confirm your attendance and notify the
          organizer.
        </Typ>
        <Typ x="p">Thanks for using Freevite!</Typ>
      </>
    )
  }

  return (
    <>
      {Title}
      <ResponseForm
        mode="CREATE"
        event={event}
        loading={loading}
        error={error}
        formMethods={formMethods}
        onSubmit={(data: FormValues) => {
          if (!data.email) throw new Error('Email is required')
          const input = { ...data, email: data.email }
          create({ variables: { eventId: event.id, input } })
        }}
      />
    </>
  )
}

export default NewResponseForm
