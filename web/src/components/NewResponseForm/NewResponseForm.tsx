import { useState } from 'react'

import {
  CreateResponseInput,
  CreateResponseMutation,
  CreateResponseMutationVariables,
  PublicEvent,
} from 'types/graphql'

import { useForm } from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'

import Typ from 'src/components/Typ/Typ'

import dayjs from '../../apiLib/dayjs'
import ResponseForm from '../ResponseForm/ResponseForm'

interface Props {
  event: Pick<PublicEvent, 'id' | 'title' | 'responseConfig'>
}

interface FormValues {
  name: string
  email: string
  headCount: number
  comment: string
  reminder: string
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

const reminderDurations = {
  '1 day': dayjs.duration(1, 'day').asSeconds(),
  '1 hour': dayjs.duration(1, 'hour').asSeconds(),
  never: null,
}

function stateToInput(state: FormValues): CreateResponseInput {
  const input: CreateResponseInput = { ...state }
  delete input['reminder']
  const durationSec = reminderDurations[state.reminder]
  if (durationSec) input.remindPriorSec = durationSec
  return input
}

const NewResponseForm = (props: Props) => {
  const { event } = props

  const formMethods = useForm({
    mode: 'onTouched',
    defaultValues: { name: '', email: '', headCount: 1, comment: '' },
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
        event={event}
        loading={loading}
        error={error}
        formMethods={formMethods}
        onSubmit={(state: FormValues) =>
          create({
            variables: { eventId: event.id, input: stateToInput(state) },
          })
        }
      />
    </>
  )
}

export default NewResponseForm
