import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import {
  UpdateEventMutation,
  UpdateEventMutationVariables,
} from 'types/graphql'

import {
  Controller,
  Form,
  FormError,
  Submit,
  TextAreaField,
  TextField,
  DatetimeLocalField,
  useForm,
} from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'

import { fieldAttrs } from 'src/style/classes'
import FormField from 'src/components/FormField/FormField'

dayjs.extend(utc)
dayjs.extend(timezone)

export type Props = {
  event: FormValues
}

interface FormValues {
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

  const eventToState = (e: FormValues) => ({
    ...e,
    start: toLocal(e.start),
    end: toLocal(e.end),
  })
  const stateToEvent = (s: FormValues) => ({
    ...s,
    start: toUTC(s.start),
    end: toUTC(s.end),
  })

  const formMethods = useForm({
    defaultValues: eventToState(event),
  })
  const { control, formState, reset } = formMethods

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
      onSubmit={(data: FormValues) =>
        save({ variables: { editToken, input: stateToEvent(data) } })
      }
    >
      <Controller
        control={control}
        name="title"
        render={({ field }) => (
          <FormField name="title" text="Title">
            <TextField
              name="title"
              validation={{ required: true }}
              onChange={field.onChange}
              value={field.value}
              {...fieldAttrs.input}
            />
          </FormField>
        )}
      />

      <div className="is-italic mb-3">
        Start/end times are in your local timezone, <strong>{tzPretty}</strong>
      </div>
      <Controller
        control={control}
        name="start"
        render={({ field }) => (
          <FormField name="start" text="Start">
            <DatetimeLocalField
              name="start"
              validation={{ required: true }}
              onChange={field.onChange}
              value={field.value}
              {...fieldAttrs.input}
            />
          </FormField>
        )}
      />

      <Controller
        control={control}
        name="end"
        render={({ field }) => (
          <FormField name="end" text="End">
            <DatetimeLocalField
              name="end"
              validation={{ required: true }}
              onChange={field.onChange}
              value={field.value}
              {...fieldAttrs.input}
            />
          </FormField>
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <FormField name="description" text="Description">
            <TextAreaField
              name="description"
              validation={{ required: true }}
              rows={8}
              onChange={field.onChange}
              value={field.value}
              {...fieldAttrs.textarea}
            />
          </FormField>
        )}
      />

      <Submit
        className="button is-primary"
        disabled={loading || !formState.isDirty || !formState.isValid}
      >
        Save Changes
      </Submit>
      <FormError error={error} wrapperClassName="form-error has-text-danger" />
    </Form>
  )
}

export default EditEventForm
