import { useState } from 'react'

import {
  CreateResponseMutation,
  CreateResponseMutationVariables,
  Event,
} from 'types/graphql'

import {
  Form,
  TextField,
  EmailField,
  FormError,
  Submit,
  useForm,
  NumberField,
  SelectField,
} from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'

import FormField from 'src/components/FormField/FormField'
import Typ from 'src/components/Typ/Typ'
import { isEmail } from 'src/logic/validation'
import { fieldAttrs, formErrorAttrs } from 'src/styles/classes'

interface FormValues {
  name: string
  email: string
  headCount: number
  comment: string
}

const CREATE_EVENT = gql`
  mutation CreateResponseMutation(
    $eventId: Int!
    $input: CreateResponseInput!
  ) {
    createResponse(eventId: $eventId, input: $input) {
      email
    }
  }
`

const NewResponseForm = ({ event }: { event: Event }) => {
  const formMethods = useForm({
    mode: 'onTouched',
    defaultValues: { name: '', email: '', headCount: 1, comment: '' },
  })
  const { formState } = formMethods

  const [sentToEmail, setSentToEmail] = useState<string | null>(null)

  const [create, { loading, error }] = useMutation<
    CreateResponseMutation,
    CreateResponseMutationVariables
  >(CREATE_EVENT, {
    onCompleted: (data) => {
      // TODO: Convert reminder into remindPriorSec
      setSentToEmail(data.createResponse.email)
    },
  })

  if (sentToEmail) {
    return (
      <>
        <Typ x="head">RSVP</Typ>

        <Typ x="p">
          A confirmation email has been sent to you at{' '}
          <strong>{sentToEmail}</strong>. Once you click the confirmation link
          in your email, we will confirm your attendance and notify the
          organizer.
        </Typ>
        <Typ x="p">Thanks for using Freevite!</Typ>
      </>
    )
  }

  return (
    <>
      <Typ x="subhead">RSVP to {event.title}</Typ>
      <Typ x="p">
        Fill out this form to let the organizer know that you will be attending.
      </Typ>

      <Form
        className="mt-3"
        formMethods={formMethods}
        onSubmit={(input: FormValues) =>
          create({ variables: { eventId: event.id, input } })
        }
      >
        <FormField name="email" text="Email Address*">
          <Typ x="labelDetails">
            We will send you a link to confirm your RSVP. Your email will not be
            shared with anyone else.
          </Typ>
          <EmailField
            name="email"
            validation={{ ...isEmail }}
            disabled={loading}
            {...fieldAttrs.input}
          />
        </FormField>

        <FormField name="reminder" text="Send Me a Reminder">
          <Typ x="labelDetails">
            If you want, we can email you a reminder so you don&apos;t forget
            about this event.
          </Typ>
          <SelectField name="reminder" disabled={loading} {...fieldAttrs.input}>
            <option value="1 day">
              Remind me 1 day before the event starts
            </option>
            <option value="1 day">
              Remind me 1 hour before the event starts
            </option>
            <option value="never">
              Do not remind me before the event starts
            </option>
          </SelectField>
        </FormField>

        <hr />
        <Typ x="p">
          Everything below this line will be shared with the event organizer and
          the other attendees.
        </Typ>
        <hr />

        <FormField name="name" text="Your Name*">
          <TextField
            name="name"
            validation={{ required: true }}
            disabled={loading}
            {...fieldAttrs.input}
          />
        </FormField>

        <FormField name="headCount" text="Head Count">
          <Typ x="labelDetails">
            How many people are you bringing, including yourself?
          </Typ>
          <NumberField
            name="headCount"
            disabled={loading}
            validation={{
              required: true,
              min: { value: 1, message: 'Must be at least 1' },
            }}
            {...fieldAttrs.input}
          />
        </FormField>

        <FormField name="comment" text="Additional Comments">
          <Typ x="labelDetails">
            Is there anything you want to share with the organizer or other
            guests?
          </Typ>
          <TextField name="comment" disabled={loading} {...fieldAttrs.input} />
        </FormField>

        <Submit
          className="button is-success mt-3"
          disabled={loading || !formState.isValid}
        >
          {loading ? 'Submitting...' : 'Submit Response'}
        </Submit>
        <FormError error={error} {...formErrorAttrs} />
      </Form>
    </>
  )
}

export default NewResponseForm
