import dayjs from 'dayjs'

import Calendar from '../Calendar/Calendar'

interface Event {
  token: string
  confirmed: boolean
  expiresAt: string
  visible: boolean
  slug: string
  title: string
  description: string
  start: string
  end: string
  reminders: string
}

interface Props {
  event: Event
}

const EventDetails = ({ event }: Props) => {
  const { start } = event
  const s = dayjs(start)
  const month = s.format('MMM')
  const day = s.format('D')
  const time = s.format('h:mm A')

  return (
    <>
      <div className="flex gap-4 prose">
        <div className="flex-initial">
          <Calendar month={month} day={day} time={time} />
        </div>
        <div>
          <h1>{event.title}</h1>
          <p>{event.description}</p>
        </div>
      </div>
    </>
  )
}

export default EventDetails
