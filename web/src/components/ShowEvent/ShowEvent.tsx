import dayjs from 'dayjs'

import { markdownToHTML } from 'src/apiLib/markdown'
import { SITE_HOST } from 'src/app.config'
import { prettyBetween, prettyDate, prettyUntil } from 'src/convert/date'

import Typ from '../Typ/Typ'

import GCal from './GcalSVG'
import ICS from './IcsSVG'

export interface Props {
  event: Event
}

interface Event {
  title: string
  description: string
  start: string
  end: string
  slug: string
}

const GCAL_DATE_FORMAT = 'YYYYMMDDTHHmmss[Z]'
const ICON_WIDTH = '200px'

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

const IconBox = ({ children }) => (
  <div className="mr-3" style={{ width: ICON_WIDTH, display: 'inline-block' }}>
    {children}
  </div>
)

const ShowEvent = ({ event }: Props) => {
  const { title, description, start, end, slug } = event
  const icsLink = `${globalThis.RWJS_API_URL}/downloadIcs?event=${slug}`
  const htmlDesc = markdownToHTML(description)

  return (
    <div className="mt-3">
      <Typ x="p" className="is-italic pb-5">
        The user-generated content below is not owned by Freevite. Please report
        abuse to <a href={`mailto:abuse@${SITE_HOST}`}>abuse@{SITE_HOST}</a>.
      </Typ>
      <h1 className="is-size-3 has-text-weight-bold mb-1">{title}</h1>
      <Typ x="p">
        <strong>From:</strong> {prettyDate(start)} ({prettyUntil(start)})
      </Typ>
      <Typ x="p">
        <strong>To:</strong> {prettyDate(end)} ({prettyBetween(start, end)}{' '}
        long)
      </Typ>
      <div className="mt-4 mb-4">
        <IconBox>
          <a href={gcalLink(event, htmlDesc)} target="_blank" rel="noreferrer">
            <GCal aria-label="Add to Google Calendar" />
          </a>
        </IconBox>
        <IconBox>
          <a href={icsLink} target="_blank" rel="noreferrer">
            <ICS aria-label="Add to Apple Calendar" />
          </a>
        </IconBox>
      </div>
      <div
        className="content pb-2"
        dangerouslySetInnerHTML={{ __html: htmlDesc }}
      />
    </div>
  )
}

export default ShowEvent
