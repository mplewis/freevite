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
  useForm,
  Controller,
  FieldError,
  CheckboxField,
  SelectField,
} from '@redwoodjs/forms'
import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import FormField from 'src/components/FormField/FormField'
import { toLocal, toUTC, tzPretty } from 'src/convert/date'
import { fieldAttrs, formErrorAttrs } from 'src/styles/classes'

import { QUERY } from '../EditEventCell'

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

function eventToState(e: Event): Event {
  return { ...e, start: toLocal(e.start), end: toLocal(e.end) }
}
function stateToEvent(s: Event): Event {
  return { ...s, start: toUTC(s.start), end: toUTC(s.end) }
}

const EditEventForm = (props: Props) => {
  const { editToken, previewToken, ...event } = props.event

  const defaultValues = eventToState(event)
  const formMethods = useForm({ mode: 'all', defaultValues })
  const { formState, reset, getValues } = formMethods

  const [save, { loading, error }] = useMutation<
    UpdateEventMutation,
    UpdateEventMutationVariables
  >(UPDATE_EVENT, {
    onCompleted: () => {
      reset(null, { keepValues: true })
      console.log('Saved') // TODO: toast?
    },
    refetchQueries: [{ query: QUERY, variables: { editToken } }],
    awaitRefetchQueries: true,
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

        {/* FIXME: This is buggy on save. */}
        <label htmlFor="visible" className="checkbox is-block mb-3">
          <CheckboxField
            id="visible"
            name="visible"
            defaultChecked={event.visible}
          />
          <span className="ml-2">Make this event visible to the public</span>
        </label>

        <Submit className="button is-primary" disabled={!savable}>
          Save Changes
        </Submit>
        <FormError error={error} {...formErrorAttrs} />
      </Form>
    </>
  )
}

export default EditEventForm
