import dayjs from 'dayjs'

import Calendar from '../Calendar/Calendar'

interface Event {
  id: 1
  createdAt: '2021-12-19T23:17:51.355Z'
  updatedAt: '2021-12-19T23:17:51.355Z'
  token: 'n99XGgaIgAkx1okglvhNEPwnESmbs416'
  confirmed: true
  expiresAt: '2022-12-19T23:17:51.355Z'
  visible: true
  slug: 'my-event'
  title: 'My Event'
  description: 'Please come to my event!'
  start: '2022-12-23T23:17:51.356Z'
  end: '2022-12-24T01:17:51.356Z'
  reminders: '1 day, 2 hours'
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
      <pre>
        <code>{JSON.stringify(event, null, 2)}</code>
      </pre>
      <Calendar month={month} day={day} time={time} />
    </>
  )
}

export default EventDetails
