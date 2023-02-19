import { useEffect } from 'react'

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
  Controller,
  FieldError,
} from '@redwoodjs/forms'
import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import FormField from 'src/components/FormField/FormField'
import { fieldAttrs, formErrorAttrs } from 'src/styles/classes'

dayjs.extend(utc)
dayjs.extend(timezone)

export type Props = {
  event: EventWithTokens
}

type Event = {
  expiresAt: string
  visible: boolean
  slug: string
  title: string
  description: string
  start: string
  end: string
  reminders: string
}

type EventWithTokens = Event & {
  editToken: string
  previewToken: string
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

const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
const tzPretty = tz.replace(/_/g, ' ')

function toLocal(d: string | Date): string {
  return dayjs(d).tz(tz).format('YYYY-MM-DDTHH:mm')
}
function toUTC(d: string | Date): string {
  return dayjs.tz(d, tz).utc().toISOString()
}

function eventToState(e: Event): Event {
  return { ...e, start: toLocal(e.start), end: toLocal(e.end) }
}
function stateToEvent(s: Event): Event {
  return { ...s, start: toUTC(s.start), end: toUTC(s.end) }
}

const EditEventForm = (props: Props) => {
  const { editToken, previewToken, ...event } = props.event

  const formMethods = useForm({
    mode: 'all',
    defaultValues: eventToState(event),
  })
  const { formState, reset, getValues } = formMethods

  const [save, { loading, error }] = useMutation<
    UpdateEventMutation,
    UpdateEventMutationVariables
  >(UPDATE_EVENT, {
    onCompleted: () => {
      reset(null, { keepValues: true })
      console.log('Saved') // TODO: toast?
    },
  })

  let savable = true
  if (loading) savable = false
  if (!formState.isDirty) savable = false
  if (!formState.isValid) savable = false

  return (
    <>
      <p className="mt-3">
        {formState.isDirty ? (
          <button className="button" disabled>
            To preview, save your changes &raquo;
          </button>
        ) : (
          <Link
            to={routes.previewEvent({ token: previewToken })}
            className="button"
          >
            Preview this event &raquo;{' '}
          </Link>
        )}
      </p>

      <hr />

      <Form
        formMethods={formMethods}
        onSubmit={(state: Event) =>
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
          Start/end times are in your local timezone,{' '}
          <strong>{tzPretty}</strong>
        </div>

        <Controller
          control={formMethods.control}
          name="start"
          render={({ field }) => (
            <label className="label" htmlFor="start">
              Start
              <div className="control">
                <input className="input" type="datetime-local" {...field} />
              </div>
              <FieldError name="start" className="error has-text-danger" />
            </label>
          )}
          rules={{
            required: true,
            validate: () =>
              getValues().end <= getValues().start
                ? 'End date must be after the start date'
                : true,
          }}
        />

        <Controller
          control={formMethods.control}
          name="end"
          render={({ field }) => (
            <label className="label" htmlFor="end">
              End
              <div className="control">
                <input className="input" type="datetime-local" {...field} />
              </div>
              <FieldError name="end" className="error has-text-danger" />
            </label>
          )}
          rules={{
            required: true,
            validate: () =>
              getValues().end <= getValues().start
                ? 'End date must be after the start date'
                : true,
          }}
        />

        <FormField name="description" text="Description">
          <TextAreaField
            name="description"
            validation={{ required: true }}
            rows={8}
            {...fieldAttrs.textarea}
          />
        </FormField>

        <Submit className="button is-primary" disabled={!savable}>
          Save Changes
        </Submit>
        <FormError error={error} {...formErrorAttrs} />
      </Form>
    </>
  )
}

export default EditEventForm
