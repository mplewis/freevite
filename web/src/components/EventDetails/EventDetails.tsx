import { useEffect, useState } from 'react'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import rehypeFilter from 'react-markdown/lib/rehype-filter'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

import Calendar from '../Calendar/Calendar'

dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(utc)

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

function relTime(date: string) {
  const now = dayjs()
  const d = dayjs(date)
  return `${d.format('ddd MMM D, h:mm a')} (${now.to(d)})`
}

function dur(start: string, end: string) {
  return dayjs.duration(dayjs(end).diff(dayjs(start))).humanize()
}

const GCAL_DATE_FORMAT = 'YYYYMMDDTHHmmss'

function toGcalDate(date: string) {
  return `${dayjs(date).utc().format(GCAL_DATE_FORMAT)}Z`
}

async function toHTML(markdown: string) {
  const v = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .use(rehypeFilter, {
      allowedElements: ['a', 'p', 'ul', 'li', 'strong', 'em'],
    })
    .process(markdown)
  return String(v)
}

function queryString(params: Record<string, string>) {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&')
}

function gcalLink(event: Event, descHTML: string) {
  const { title, start, end } = event
  const dates = `${toGcalDate(start)}/${toGcalDate(end)}`
  const details = descHTML.replaceAll('<p>', '').replaceAll('</p>', '\n')
  const query = queryString({ dates, details, text: title })
  return `https://calendar.google.com/calendar/r/eventedit?${query}`
}

const EventDetails = ({ event }: Props) => {
  const { start } = event
  const s = dayjs(start)
  const month = s.format('MMM')
  const day = s.format('D')
  const time = s.format('h:mm A')

  const [html, setHtml] = useState('')
  useEffect(() => {
    ;(async () => setHtml(await toHTML(event.description)))()
  })

  const desc = (html: string) => (
    <>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <pre>
        <code>
          {gcalLink(event, html).replaceAll('?', '\n').replaceAll('&', '\n')}
        </code>
      </pre>
      <pre>
        <code>{html}</code>
      </pre>
      <a href={gcalLink(event, html)} target="_blank" rel="noreferrer">
        Add to Google Calendar
      </a>
    </>
  )

  const placeholder = (
    <p>
      <em>Loading event description...</em>
    </p>
  )

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
          {html ? desc(html) : placeholder}
        </div>
      </div>
    </>
  )
}

export default EventDetails
