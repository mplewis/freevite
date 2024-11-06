import { ApolloError } from '@apollo/client/errors'
import { Response, PublicEvent } from 'types/graphql'

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

import dayjs from '../../apiLib/dayjs'

export type Props = {
  event: Pick<PublicEvent, 'responseConfig'>
  existingData?: FormValues

  loading: boolean
  error?: ApolloError
  formMethods: UseFormReturn<FormValues>
  onSubmit: (data: FormValues) => void
}

export type FormValues = Pick<
  Response,
  'name' | 'email' | 'headCount' | 'comment'
> & {
  reminder: ReminderDuration
}

export const reminderDurations = {
  '1 day': dayjs.duration(1, 'day').asSeconds(),
  '1 hour': dayjs.duration(1, 'hour').asSeconds(),
  never: null,
}

export type ReminderDuration = keyof typeof reminderDurations

const ResponseForm = (props: Props) => {
  const { event, error, loading, formMethods, onSubmit } = props
  const { formState } = formMethods

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
      <Typ x="p">
        Want to edit your RSVP? Use the confirmation link in your email.
      </Typ>

      <Form className="mt-3" formMethods={formMethods} onSubmit={onSubmit}>
        <FormField name="email" text="Email Address*">
          <Typ x="labelDetails">
            We will send you a link to confirm. Your email will not be shared
            with anyone else.
          </Typ>
          <EmailField
            name="email"
            validation={{ ...isEmail }}
            disabled={loading}
            {...fieldAttrs.input}
          />
        </FormField>

        <FormField name="name" text="Your Name*">
          <TextField
            name="name"
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
          <SelectField name="reminder" disabled={loading} {...fieldAttrs.input}>
            {Object.entries(reminderDurations).map(([label, value]) => (
              <option key={label} value={label}>
                {value
                  ? `Remind me ${label} before the event starts`
                  : 'Do not send me a reminder'}
              </option>
            ))}
          </SelectField>
        </FormField>

        <Submit
          className="button is-success mt-3"
          disabled={loading || !formState.isValid}
        >
          {loading ? 'Submitting...' : 'Submit RSVP'}
        </Submit>
        <FormError error={error} {...formErrorAttrs} />
      </Form>
    </>
  )
}

export default ResponseForm
