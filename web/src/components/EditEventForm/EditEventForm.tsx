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

import { fieldAttrs } from 'src/classes'
import FormLabel from 'src/components/FormLabel/FormLabel'

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
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  // const tzPretty = tz.replace(/_/g, ' ')
  const toLocal = (d: string) => dayjs(d).tz(tz).format('YYYY-MM-DDTHH:mm')
  const toUTC = (d: string) => dayjs.tz(d, tz).utc().toISOString()

  const { editToken } = event

  const { control } = useForm({
    defaultValues: {
      ...event,
      start: toLocal(event.start),
      end: toLocal(event.end),
    },
  })

  const [save, { loading, error }] = useMutation<
    UpdateEventMutation,
    UpdateEventMutationVariables
  >(UPDATE_EVENT, {
    onCompleted: () => {
      console.log('Saved') // TODO: toast?
    },
  })

  return (
    <Form
      onSubmit={(input: FormValues) =>
        save({
          variables: {
            editToken,
            input: {
              ...input,
              start: toUTC(input.start),
              end: toUTC(input.end),
            },
          },
        })
      }
    >
      <FormError error={error} wrapperClassName="form-error" />

      <Controller
        control={control}
        name="title"
        render={({ field }) => {
          return (
            <FormLabel name="title" text="Title">
              <TextField
                name="title"
                validation={{ required: true }}
                onChange={field.onChange}
                value={field.value}
                {...fieldAttrs}
              />
            </FormLabel>
          )
        }}
      />

      <div>Timezone: {tz}</div>
      <Controller
        control={control}
        name="start"
        render={({ field }) => {
          return (
            <FormLabel name="start" text="Start">
              <DatetimeLocalField
                name="start"
                validation={{ required: true }}
                onChange={field.onChange}
                value={field.value}
                {...fieldAttrs}
              />
            </FormLabel>
          )
        }}
      />

      <Controller
        control={control}
        name="end"
        render={({ field }) => {
          return (
            <FormLabel name="end" text="End">
              <DatetimeLocalField
                name="end"
                validation={{ required: true }}
                onChange={field.onChange}
                value={field.value}
                {...fieldAttrs}
              />
            </FormLabel>
          )
        }}
      />

      <Controller
        control={control}
        name="description"
        render={({ field }) => {
          return (
            <FormLabel name="description" text="Description">
              <TextAreaField
                name="description"
                validation={{ required: true }}
                rows={4}
                onChange={field.onChange}
                value={field.value}
                {...fieldAttrs}
              />
            </FormLabel>
          )
        }}
      />

      <Submit disabled={loading}>Save</Submit>
    </Form>
  )
}

export default EditEventForm
