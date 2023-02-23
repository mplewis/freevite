import { useEffect, useState } from 'react'

import dayjs from 'dayjs'

import { SITE_HOST } from 'src/app.config'
import { prettyBetween, prettyDate, prettyUntil } from 'src/convert/date'
import { markdownToHTML } from 'src/convert/markdown'

import Typ from '../Typ/Typ'

export interface Props {
  event: Event
}

interface Event {
  title: string
  description: string
  start: string
  end: string
}

const GCAL_DATE_FORMAT = 'YYYYMMDDTHHmmss[Z]'

function toGcalDate(date: string) {
  return dayjs(date).utc().format(GCAL_DATE_FORMAT)
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

const ShowEvent = ({ event }: Props) => {
  const { title, description, start, end } = event
  const [htmlDesc, setHtmlDesc] = useState<string>(
    '<em>Rendering Markdown description...</em>'
  )
  useEffect(() => {
    markdownToHTML(description).then(setHtmlDesc)
  }, [description])
  return (
    <div className="mt-3">
      <Typ x="p" className="is-italic">
        The user-generated content below is not owned by Freevite. Please report
        abuse to <a href={`mailto:abuse@${SITE_HOST}`}>abuse@{SITE_HOST}</a>.
      </Typ>
      <hr />
      <h1 className="is-size-3 has-text-weight-bold mb-3">{title}</h1>
      <Typ x="p">
        <strong>From:</strong> {prettyDate(start)} ({prettyUntil(start)})
      </Typ>
      <Typ x="p">
        <strong>To:</strong> {prettyDate(end)} ({prettyBetween(start, end)}{' '}
        long)
      </Typ>
      <Typ x="p">
        <a href={gcalLink(event, htmlDesc)} target="_blank" rel="noreferrer">
          Add to Google Calendar
        </a>
      </Typ>
      <Typ x="p">Add to iCal</Typ>
      <hr />
      <Typ x="p" className="content">
        <div dangerouslySetInnerHTML={{ __html: htmlDesc }} />
      </Typ>
    </div>
  )
}

export default ShowEvent
