import { useEffect, useState } from 'react'

import { ApolloError } from '@apollo/client/errors'
import ReCAPTCHA from 'react-google-recaptcha'
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
  CheckboxField,
} from '@redwoodjs/forms'

import { reminderDurations } from 'src/apiLibShared/reminder'
import { RECAPTCHA_CLIENT_KEY } from 'src/apiLibShared/shared.config'
import FormField from 'src/components/FormField/FormField'
import Typ from 'src/components/Typ/Typ'
import { isEmail } from 'src/logic/validation'
import { fieldAttrs, formErrorAttrs } from 'src/styles/classes'

export type Props = {
  mode: 'CREATE' | 'UPDATE'
  event: Pick<PublicEvent, 'responseConfig'>

  loading: boolean
  error?: ApolloError
  formMethods: UseFormReturn<FormValues>
  onChange?: React.FormEventHandler<HTMLFormElement>
  onCaptchaResponse?: (response: string | null) => void
  onSubmit: (data: FormValues) => void
}

export type FormValues = SetOptional<
  Pick<
    UpdatableResponse,
    | 'name'
    | 'headCount'
    | 'comment'
    | 'remindPriorSec'
    | 'email'
    | 'notiEventUpdated'
    | 'notiEventDeleted'
  >,
  'email'
>

const firstNames = ['Sam', 'Chris', 'Alex', 'Taylor', 'Jordan', 'Casey']
const lastNames = ['Public', 'Sample', 'Example', "O'Public", 'McSample', 'Doe']

function random<T>(choices: T[]): T {
  return choices[Math.floor(Math.random() * choices.length)]
}

const ResponseForm = (props: Props) => {
  const {
    mode,
    event,
    error,
    loading,
    formMethods,
    onChange,
    onCaptchaResponse,
    onSubmit,
  } = props
  const { formState, getValues } = formMethods

  const { email } = getValues()
  const forbidResubmit = (() => {
    if (!email) return false
    return email === error?.cause?.extensions?.['forbidResubmitForEmail']
  })()

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

        <h3 className="is-size-4 mt-3 mb-1 has-text-weight-semibold">
          Notifications
        </h3>

        <label htmlFor="notiEventUpdated" className="checkbox is-block py-1">
          <CheckboxField
            id="notiEventUpdated"
            name="notiEventUpdated"
            disabled={loading}
          />
          <span className="ml-2">Email me if this event is updated</span>
        </label>

        <label htmlFor="notiEventDeleted" className="checkbox is-block py-1">
          <CheckboxField
            id="notiEventDeleted"
            name="notiEventDeleted"
            disabled={loading}
          />
          <span className="ml-2">Email me if this event is canceled</span>
        </label>

        {mode === 'CREATE' && (
          <ReCAPTCHA
            sitekey={RECAPTCHA_CLIENT_KEY}
            onChange={onCaptchaResponse}
            className="mt-4"
          />
        )}

        <Submit
          className="button is-success mt-3"
          disabled={
            loading ||
            !formState.isValid ||
            !formState.isDirty ||
            forbidResubmit
          }
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
