import { useState } from 'react'

import Select, { Theme } from 'react-select'
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
import { localTZ, toLocal, toUTC } from 'src/convert/date'
import { listTimeZones } from 'src/convert/tz'
import { fieldAttrs, formErrorAttrs } from 'src/styles/classes'

import { QUERY } from '../EditEventCell'
import PageHead from '../PageHead/PageHead'
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
  location: string
  start: string
  end: string
  timezone?: string
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
      location
      start
      end
      timezone
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
  const tz = e.timezone ?? 'UTC'
  return { ...e, start: toLocal(e.start, tz), end: toLocal(e.end, tz) }
}
function stateToEvent(s: Event): Event {
  const tz = s.timezone ?? 'UTC'
  s = { ...s, start: toUTC(s.start, tz), end: toUTC(s.end, tz) }
  delete s.confirmed
  return s
}

function darkMode(): boolean {
  // https://stackoverflow.com/a/57795495/254187
  return (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
}

function updateSelectThemeToMatchDarkMode(theme: Theme): Theme {
  if (!darkMode()) return theme

  // Invert neutrals
  const newColors = { ...theme.colors }
  const neutralKeys = Object.keys(theme.colors)
    .filter((k) => k.startsWith('neutral'))
    .sort()
  const neutralValues = neutralKeys.map((k) => theme.colors[k]).reverse()
  neutralKeys.forEach((k, i) => {
    newColors[k] = neutralValues[i]
  })

  // TODO: Fix disabled state dark mode colors
  const primary = 'rgba(72, 131, 255, ALPHA)'
  const primaries = {
    primary25: primary.replace('ALPHA', '0.25'),
    primary50: primary.replace('ALPHA', '0.5'),
    primary75: primary.replace('ALPHA', '0.75'),
    primary: primary.replace('ALPHA', '1.0'),
  }

  return {
    ...theme,
    colors: {
      ...newColors,
      ...primaries,
    },
  }
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
      `Warning! You are about to permanently delete the event "${event.title}". ` +
        'This action cannot be undone. To confirm, type "DELETE":'
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

  const tzs = listTimeZones(new Date(event.start)).sort((a, b) => {
    if (a.offsetMins === b.offsetMins) return a.name.localeCompare(b.name)
    return a.offsetMins - b.offsetMins
  })
  const tzOptions = tzs.map((tz) => ({
    value: tz.name,
    label: `${tz.name.replaceAll('_', ' ')} (${tz.offsetHrs})`,
  }))

  return (
    <>
      <PageHead
        title="Edit Event"
        desc={`Edit the details of your "${event.title}" event.`}
      />
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
        <FormField name="title" text="Title*">
          <TextField
            name="title"
            validation={{ required: true }}
            disabled={loading}
            {...fieldAttrs.input}
          />
        </FormField>

        <FormField name="location" text="Location">
          <Typ x="labelDetails">
            Use a name and street address for best results. For example:
            Nallen&apos;s Irish Pub, 1429 Market St, Denver, CO 80202
          </Typ>
          <TextField name="location" disabled={loading} {...fieldAttrs.input} />
        </FormField>

        <Controller
          control={formMethods.control}
          name="timezone"
          render={({ field }) => {
            if (!field.value) {
              field.value = localTZ
              field.onChange(localTZ)
            }
            return (
              <label className="label" htmlFor="timezone">
                Time zone*
                <br />
                <div className="control">
                  <Select
                    id="timezone"
                    ref={field.ref}
                    name={field.name}
                    options={tzOptions}
                    value={tzOptions.find((o) => o.value === field.value)}
                    onChange={({ value }) => field.onChange(value)}
                    onBlur={field.onBlur}
                    isDisabled={field.disabled || loading}
                    className={'has-text-weight-normal'}
                    theme={updateSelectThemeToMatchDarkMode}
                  />
                </div>
                <FieldError name="timezone" className="error has-text-danger" />
              </label>
            )
          }}
        />

        <Controller
          control={formMethods.control}
          name="start"
          render={({ field }) => (
            <label className="label" htmlFor="start">
              Start*
              <br />
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
              End*
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

        <FormField name="slug" text="Slug*">
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

        <FormField name="description" text="Description*">
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

        <label htmlFor="visible" className="checkbox is-block mb-5 py-3">
          <CheckboxField
            id="visible"
            name="visible"
            defaultChecked={event.visible}
            disabled={loading}
          />
          <span className="ml-2">Make this event visible to the public</span>
        </label>

        <Submit className="button is-success" disabled={!savable}>
          {loading ? 'Saving...' : 'Save Changes'}
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
