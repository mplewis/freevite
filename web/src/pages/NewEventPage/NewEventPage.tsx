import { MetaTags } from '@redwoodjs/web'

import EventForm from 'src/components/EventForm/EventForm'

const NewEventPage = () => {
  return (
    <>
      <MetaTags title="NewEvent" description="NewEvent page" />

      <h1>Create New Event</h1>

      <EventForm />
    </>
  )
}

export default NewEventPage
