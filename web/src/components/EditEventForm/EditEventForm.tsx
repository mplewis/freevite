import { useState } from 'react'

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
import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import { fqUrlForPath } from 'src/apiLib/url'
import { checkVisibility } from 'src/apiLib/visibility'
import FormField from 'src/components/FormField/FormField'
import { toLocal, toUTC, tzPretty } from 'src/convert/date'
import { fieldAttrs, formErrorAttrs } from 'src/styles/classes'

import { QUERY } from '../EditEventCell'
import Typ from '../Typ/Typ'

import { PreView } from './PreView'

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

  const [currSlug, setCurrSlug] = useState(event.slug)
  const eventLink = routes.viewEvent({ slug: currSlug })
  const fqEventLink = fqUrlForPath(eventLink)

  return (
    <>
      <PreView
        isPublic={visible}
        dirty={formState.isDirty}
        slug={event.slug}
        previewToken={previewToken}
      />

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
            disabled={loading}
            {...fieldAttrs.input}
          />
        </FormField>

        <Controller
          control={formMethods.control}
          name="start"
          render={({ field }) => (
            <label className="label" htmlFor="start">
              Start
              <br />
              <Typ x="labelDetails">
                Start/end times are in your local timezone,{' '}
                <strong>{tzPretty}</strong>
              </Typ>
              <div className="control">
                <input
                  id="start"
                  className="input"
                  type="datetime-local"
                  disabled={loading}
                  {...field}
                />
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
                <input
                  id="end"
                  className="input"
                  type="datetime-local"
                  disabled={loading}
                  {...field}
                />
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

        <FormField name="slug" text="Slug">
          <Typ x="labelDetails">
            Your event&apos;s public link will be <code>{fqEventLink}</code>
          </Typ>
          <TextField
            name="slug"
            disabled={loading}
            validation={{
              required: true,
              validate: {
                chars: (slug) => {
                  if (!/^[a-z0-9-]+$/.test(slug))
                    return 'slug can only contain lowercase letters, numbers, and dashes'
                },
              },
            }}
            onChange={(e) => setCurrSlug(e.target.value)}
            {...fieldAttrs.input}
          />
        </FormField>

        <FormField name="description" text="Description">
          <Typ x="labelDetails">
            You can use{' '}
            <a
              href="https://www.markdownguide.org"
              target="_blank"
              rel="noreferrer"
            >
              Markdown
            </a>{' '}
            to style this section.
          </Typ>
          <TextAreaField
            name="description"
            validation={{ required: true }}
            rows={8}
            disabled={loading}
            {...fieldAttrs.textarea}
          />
        </FormField>

        <label htmlFor="visible" className="checkbox is-block mb-3">
          <CheckboxField
            id="visible"
            name="visible"
            defaultChecked={event.visible}
            disabled={loading}
          />
          <span className="ml-2">Make this event visible to the public</span>
        </label>

        <Submit className="button is-success" disabled={!savable}>
          Save Changes
        </Submit>
        <FormError error={error} {...formErrorAttrs} />
        <div className="mt-3">
          <button
            className="button is-danger"
            disabled={loading}
            onClick={promptDestroy}
          >
            Delete Event
          </button>
        </div>
      </Form>
    </>
  )
}

export default EditEventForm
