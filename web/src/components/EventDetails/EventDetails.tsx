import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import ReactMarkdown from 'react-markdown'

import Calendar from '../Calendar/Calendar'

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(duration)

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

const relTime = (date: string) => {
  const now = dayjs()
  const d = dayjs(date)
  return `${d.format('ddd MMM D, h:mm a')} (${now.to(d)})`
}

const dur = (start: string, end: string) => {
  return dayjs.duration(dayjs(end).diff(dayjs(start))).humanize()
}

const EventDetails = ({ event }: Props) => {
  const { start } = event
  const s = dayjs(start)
  const month = s.format('MMM')
  const day = s.format('D')
  const time = s.format('h:mm A')

  return (
    <>
      <div className="prose flex gap-4">
        <div className="flex-initial">
          <Calendar month={month} day={day} time={time} />
        </div>
        <div>
          <h1>{event.title}</h1>
          <ul>
            <li>
              <strong>Start:</strong> {relTime(event.start)}
            </li>
            <li>
              <strong>End:</strong> {relTime(event.end)}
            </li>
            <li>
              <strong>Duration:</strong> {dur(event.start, event.end)}
            </li>
          </ul>
          <div>
            <ReactMarkdown linkTarget={'_blank'} allowedElements={['p', 'a']}>
              {event.description}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </>
  )
}

export default EventDetails