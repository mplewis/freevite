import { useState } from 'react'

import {
  CreateResponseMutation,
  CreateResponseMutationVariables,
  PublicEvent,
} from 'types/graphql'

import { useForm } from '@redwoodjs/forms'
import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import Typ from 'src/components/Typ/Typ'

import ResponseForm, { FormValues } from '../ResponseForm/ResponseForm'

interface Props {
  event: Pick<PublicEvent, 'id' | 'title' | 'responseConfig'>
  responseToken?: string
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

const NewResponseForm = ({ event, responseToken }: Props) => {
  const formMethods = useForm<FormValues>({
    mode: 'onTouched',
    defaultValues: { headCount: 1 },
  })

  const [captchaResponse, setCaptchaResponse] = useState<string | null>(null)
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

  const Title = <Typ x="subhead">RSVP to {event.title}</Typ>

  if (responseToken) {
    return (
      <>
        {Title}
        <Typ x="p">You&apos;ve already submitted your RSVP for this event.</Typ>
        <Link
          to={routes.confirmResponse({ token: responseToken })}
          className="button is-primary mt-2"
        >
          Edit my RSVP &raquo;
        </Link>
      </>
    )
  }

  if (createdForEmail) {
    return (
      <>
        {Title}
        <Typ
          x="p"
          className="notification is-primary has-text-centered annoying-noti"
        >
          <div className="has-text-weight-semibold">
            <span className="annoying-noti-hands">👉 👉</span> Check your email!{' '}
            <span className="annoying-noti-hands">👈 👈</span>
          </div>
          We&apos;ll confirm your RSVP when you click the link in the email.
        </Typ>
        <style>
          {`
            @keyframes blink-border {
              0%, 20% {
                border-color: white;
              }
              10% {
                border-color: transparent;
              }
            }

            @keyframes animate-padding {
              0%, 100% {
                padding: 0 8px;
              }
              50% {
                padding: 0 16px;
              }
            }

            .annoying-noti {
              border: 4px dashed white;
              border-radius: 12px;
              animation: blink-border 3s infinite;
            }

            .annoying-noti-hands {
              animation: animate-padding 0.5s infinite;
            }
          `}
        </style>
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
        onCaptchaResponse={setCaptchaResponse}
        onSubmit={(data: FormValues) => {
          if (!data.email) throw new Error('Email is required')
          const input = { ...data, email: data.email, captchaResponse }
          create({ variables: { eventId: event.id, input } })
        }}
      />
    </>
  )
}

export default NewResponseForm
