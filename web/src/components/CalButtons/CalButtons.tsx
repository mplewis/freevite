import dayjs from 'src/apiLibShared/dayjs'
import { downloadICS, generateICS } from 'src/lib/ics'
import type { PublicEvent as _PublicEvent } from 'types/graphql'

import GCal from './GcalSVG'
import ICS from './IcsSVG'

export type Props = {
  event: PublicEvent
  htmlDesc: string
}

type PublicEvent = Pick<
  _PublicEvent,
  'title' | 'slug' | 'start' | 'end' | 'location' | 'description'
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
  <div className='mr-3' style={{ width: ICON_WIDTH, display: 'inline-block' }}>
    {children}
  </div>
)

const CalButtons = ({ event, htmlDesc }: Props) => {
  const handleIcsClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    const icsContent = await generateICS(event)
    downloadICS(icsContent, event.title)
  }

  return (
    <>
      <IconBox>
        <a href={gcalLink(event, htmlDesc)} target='_blank' rel='noreferrer'>
          <GCal aria-label='Add to Google Calendar' />
        </a>
      </IconBox>
      <IconBox>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href='#' onClick={handleIcsClick} role='button'>
          <ICS aria-label='Add to Apple Calendar' />
        </a>
      </IconBox>
    </>
  )
}

export default CalButtons
