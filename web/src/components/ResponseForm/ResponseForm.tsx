import { useEffect, useState } from 'react'

import { ApolloError } from '@apollo/client/errors'
import { SetOptional } from 'type-fest'
import { PublicEvent, UpdatableResponse } from 'types/graphql'

import {
  Form,
  TextField,
  EmailField,
  FormError,
  Submit,
  NumberField,
  SelectField,
  UseFormReturn,
} from '@redwoodjs/forms'

import FormField from 'src/components/FormField/FormField'
import Typ from 'src/components/Typ/Typ'
import { isEmail } from 'src/logic/validation'
import { fieldAttrs, formErrorAttrs } from 'src/styles/classes'

import { reminderDurations } from '../../apiLib/reminder'

export type Props = {
  mode: 'CREATE' | 'UPDATE'
  event: Pick<PublicEvent, 'responseConfig'>

  loading: boolean
  error?: ApolloError
  formMethods: UseFormReturn<FormValues>
  onChange?: React.FormEventHandler<HTMLFormElement>
  onSubmit: (data: FormValues) => void
}

export type FormValues = SetOptional<
  Pick<
    UpdatableResponse,
    'name' | 'headCount' | 'comment' | 'remindPriorSec' | 'email'
  >,
  'email'
>

const firstNames = ['Sam', 'Chris', 'Alex', 'Taylor', 'Jordan', 'Casey']
const lastNames = ['Public', 'Sample', 'Example', "O'Public", 'McSample', 'Doe']

function random<T>(choices: T[]): T {
  return choices[Math.floor(Math.random() * choices.length)]
}

const ResponseForm = (props: Props) => {
  const { mode, event, error, loading, formMethods, onChange, onSubmit } = props
  const { formState } = formMethods

  const [exampleName, setExampleName] = useState('')
  useEffect(() => {
    setExampleName(`${random(firstNames)} ${random(lastNames)}`)
  }, [])

  const privacyNote = (() => {
    switch (event.responseConfig) {
      case 'SHOW_ALL':
        return (
          'Your name, head count, and comments will be shared ' +
          'with the organizer and other guests.'
        )
      case 'SHOW_COUNTS_ONLY':
        return 'Only your head count will be shared with the organizer and other guests.'
      default:
        return 'Your response will only be shared with the organizer.'
    }
  })()

  return (
    <>
      <Typ x="p">{privacyNote}</Typ>

      <Form
        className="mt-3"
        formMethods={formMethods}
        onChange={onChange}
        onSubmit={onSubmit}
      >
        {mode === 'CREATE' && (
          <FormField name="email" text="Email Address*">
            <Typ x="labelDetails">
              We will send you a link to confirm. Your email will not be shared
              with anyone else.
            </Typ>
            <EmailField
              name="email"
              placeholder="yourname@example.com"
              validation={{ ...isEmail }}
              disabled={loading}
              {...fieldAttrs.input}
            />
          </FormField>
        )}

        <FormField name="name" text="Your Name*">
          <TextField
            name="name"
            placeholder={exampleName}
            validation={{ required: true }}
            disabled={loading}
            {...fieldAttrs.input}
          />
        </FormField>

        <FormField name="headCount" text="Head Count*">
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
            Is there anything you want the organizer{' '}
            {event.responseConfig === 'SHOW_ALL' && 'and other guests '}to know?
          </Typ>
          <TextField name="comment" disabled={loading} {...fieldAttrs.input} />
        </FormField>

        <FormField name="reminder" text="Send Me a Reminder">
          <Typ x="labelDetails">
            If you want, we can email you a reminder so you don&apos;t forget
            about this event.
          </Typ>
          <SelectField
            name="remindPriorSec"
            disabled={loading}
            validation={{ valueAsNumber: true }}
            {...fieldAttrs.input}
          >
            {Object.entries(reminderDurations).map(([label, value]) => (
              <option key={label} value={value}>
                {value
                  ? `Remind me ${label} before the event starts`
                  : 'Do not send me a reminder'}
              </option>
            ))}
          </SelectField>
        </FormField>

        <Submit
          className="button is-success mt-3"
          disabled={loading || !formState.isValid || !formState.isDirty}
        >
          {mode === 'CREATE'
            ? loading
              ? 'Submitting...'
              : 'Submit RSVP'
            : loading
              ? 'Updating...'
              : 'Update RSVP'}
        </Submit>
        <FormError error={error} {...formErrorAttrs} />
      </Form>
    </>
  )
}

export default ResponseForm
