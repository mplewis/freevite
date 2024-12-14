import { PublicEvent as _PublicEvent } from 'types/graphql'

import dayjs from 'src/apiLibShared/dayjs'

import GCal from './GcalSVG'
import ICS from './IcsSVG'

export type Props = {
  event: PublicEvent
  htmlDesc: string
}

type PublicEvent = Pick<
  _PublicEvent,
  'title' | 'slug' | 'start' | 'end' | 'location'
>

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

function gcalLink(event: PublicEvent, descHTML: string) {
  const { title, start, end, location } = event
  const dates = `${toGcalDate(start)}/${toGcalDate(end)}`
  const details = descHTML.replaceAll('<p>', '').replaceAll('</p>', '\n')
  const query = queryString({ dates, details, location, text: title })
  return `https://calendar.google.com/calendar/r/eventedit?${query}`
}

const IconBox = ({ children }) => (
  <div className="mr-3" style={{ width: ICON_WIDTH, display: 'inline-block' }}>
    {children}
  </div>
)

const CalButtons = ({ event, htmlDesc }: Props) => {
  const { slug } = event
  const icsLink = `${globalThis.RWJS_API_URL}/downloadIcs?event=${slug}`

  return (
    <>
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
    </>
  )
}

export default CalButtons
