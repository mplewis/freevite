import {
  UpdateEventMutation,
  UpdateEventMutationVariables,
  DeleteEventMutation,
  DeleteEventMutationVariables,
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
} from '@redwoodjs/forms'
import { Link, navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import { checkVisibility } from 'src/apiLib/visibility'
import FormField from 'src/components/FormField/FormField'
import { toLocal, toUTC, tzPretty } from 'src/convert/date'
import { fieldAttrs, formErrorAttrs } from 'src/styles/classes'

import { QUERY } from '../EditEventCell'

export type Props = {
  event: EventWithTokens
}

type Event = {
  visible: boolean
  confirmed: boolean
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

const DELETE_EVENT = gql`
  mutation DeleteEventMutation($editToken: String!) {
    deleteEvent(editToken: $editToken) {
      id
    }
  }
`

function eventToState(e: Event): Event {
  return { ...e, start: toLocal(e.start), end: toLocal(e.end) }
}
function stateToEvent(s: Event): Event {
  s = { ...s, start: toUTC(s.start), end: toUTC(s.end) }
  delete s.confirmed
  return s
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
      reset(getValues())
      console.log('Saved') // TODO: toast?
    },
    refetchQueries: [{ query: QUERY, variables: { editToken } }],
    awaitRefetchQueries: true,
  })

  const [destroy] = useMutation<
    DeleteEventMutation,
    DeleteEventMutationVariables
  >(DELETE_EVENT, {
    onCompleted: () => {
      alert('Event deleted.')
      navigate(routes.home())
    },
    onError: (error) => {
      alert(`Sorry, something went wrong:\n${error}`)
    },
  })

  const promptDestroy = () => {
    const resp = prompt(
      `Warning! You are about to permanently delete the event "${event.title}". This action cannot be undone. To confirm, type "DELETE":`
    )
    if (resp === null) return
    if (resp !== 'DELETE') {
      alert('Confirmation failed. Event was not deleted.')
      return
    }
    destroy({ variables: { editToken } })
  }

  let savable = true
  if (loading) savable = false
  if (!formState.isDirty) savable = false
  if (!formState.isValid) savable = false

  const { visible } = checkVisibility(event)

  return (
    <>
      <p className="mb-3">
        {visible && (
          <a
            href={routes.viewEvent({ slug: event.slug })}
            className="button is-primary"
            target="_blank"
            rel="noreferrer"
          >
            View the public event page &raquo;
          </a>
        )}
      </p>

      <p className="mb-3">
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
        <div className="is-italic mb-3">
          Your event will be deleted from the system 30 days after it ends.
        </div>

        <FormField name="description" text="Description">
          <TextAreaField
            name="description"
            validation={{ required: true }}
            rows={8}
            {...fieldAttrs.textarea}
          />
        </FormField>

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
        <div className="mt-3">
          <button className="button is-danger" onClick={promptDestroy}>
            Delete Event
          </button>
        </div>
      </Form>
    </>
  )
}

export default EditEventForm
