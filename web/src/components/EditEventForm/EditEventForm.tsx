import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import {
  UpdateEventMutation,
  UpdateEventMutationVariables,
} from 'types/graphql'

import {
  Form,
  FormError,
  Submit,
  TextAreaField,
  TextField,
  DatetimeLocalField,
  useForm,
} from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'

import FormField from 'src/components/FormField/FormField'
import { fieldAttrs, formErrorAttrs } from 'src/style/classes'

dayjs.extend(utc)
dayjs.extend(timezone)

export type Props = {
  event: Event
}

interface Event {
  editToken: string
  expiresAt: string
  visible: boolean
  slug: string
  title: string
  description: string
  start: string
  end: string
  reminders: string
}

interface State extends Event {
  __typename: string
}

const UPDATE_EVENT = gql`
  mutation UpdateEventMutation($editToken: String!, $input: UpdateEventInput!) {
    updateEvent(editToken: $editToken, input: $input) {
      expiresAt
      visible
      slug
      title
      description
      start
      end
      reminders
    }
  }
`

const EditEventForm = ({ event }: Props) => {
  const { editToken } = event

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const tzPretty = tz.replace(/_/g, ' ')
  const toLocal = (d: string) => dayjs(d).tz(tz).format('YYYY-MM-DDTHH:mm')
  const toUTC = (d: string) => dayjs.tz(d, tz).utc().toISOString()

  const eventToState = (e: Event) => ({
    ...e,
    start: toLocal(e.start),
    end: toLocal(e.end),
  })
  const stateToEvent = (s: State) => {
    const e = {
      ...s,
      start: toUTC(s.start),
      end: toUTC(s.end),
    }
    delete e.editToken
    delete e.__typename
    return e
  }

  const formMethods = useForm({
    mode: 'all',
    defaultValues: eventToState(event),
  })
  const { formState, reset, getValues } = formMethods

  const [save, { loading, error }] = useMutation<
    UpdateEventMutation,
    UpdateEventMutationVariables
  >(UPDATE_EVENT, {
    onCompleted: (data) => {
      reset(eventToState({ ...data.updateEvent, editToken }))
      console.log('Saved') // TODO: toast?
    },
  })

  return (
    <Form
      formMethods={formMethods}
      onSubmit={(state: State) =>
        save({ variables: { editToken, input: stateToEvent(state) } })
      }
    >
      <FormField name="title" text="Title">
        <TextField
          name="title"
          validation={{ required: true }}
          {...fieldAttrs.input}
        />
      </FormField>

      <div className="is-italic mb-3">
        Start/end times are in your local timezone, <strong>{tzPretty}</strong>
      </div>
      <FormField name="start" text="Start">
        <DatetimeLocalField
          name="start"
          validation={{ required: true }}
          {...fieldAttrs.input}
        />
      </FormField>

      <FormField name="end" text="End">
        <DatetimeLocalField
          name="end"
          validation={{
            required: true,
            validate: () =>
              getValues().end <= getValues().start
                ? 'End date must be after the start date'
                : true,
          }}
          {...fieldAttrs.input}
        />
      </FormField>

      <FormField name="description" text="Description">
        <TextAreaField
          name="description"
          validation={{ required: true }}
          rows={8}
          {...fieldAttrs.textarea}
        />
      </FormField>

      <Submit
        className="button is-primary"
        disabled={loading || !formState.isDirty || !formState.isValid}
      >
        Save Changes
      </Submit>
      <FormError error={error} {...formErrorAttrs} />
    </Form>
  )
}

export default EditEventForm
