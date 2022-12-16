import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import EventForm from 'src/components/Event/EventForm'

import type { CreateEventInput } from 'types/graphql'

const CREATE_EVENT_MUTATION = gql`
  mutation CreateEventMutation($input: CreateEventInput!) {
    createEvent(input: $input) {
      id
    }
  }
`

const NewEvent = () => {
  const [createEvent, { loading, error }] = useMutation(
    CREATE_EVENT_MUTATION,
    {
      onCompleted: () => {
        toast.success('Event created')
        navigate(routes.events())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateEventInput) => {
    createEvent({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Event</h2>
      </header>
      <div className="rw-segment-main">
        <EventForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewEvent
