import EventCell from 'src/components/Event/EventCell'

type EventPageProps = {
  id: number
}

const EventPage = ({ id }: EventPageProps) => {
  return <EventCell id={id} />
}

export default EventPage
