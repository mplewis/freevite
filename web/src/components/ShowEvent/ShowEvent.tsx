import dayjs from 'dayjs'
import pluralize from 'pluralize'
import { PublicEvent } from 'types/graphql'

import { markdownToHTML } from 'src/apiLib/markdown'
import { SITE_HOST } from 'src/app.config'
import { prettyBetween, prettyDate, prettyUntil } from 'src/convert/date'

import NewResponseForm from '../NewResponseForm/NewResponseForm'
import Typ from '../Typ/Typ'

import GCal from './GcalSVG'
import ICS from './IcsSVG'

export interface Props {
  event: PublicEvent
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

function gcalLink(event: PublicEvent, descHTML: string) {
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

const ResponseSummary = (event) => {
  if (!event.responseSummary) return null

  const attd = pluralize('person', event.responseSummary.headCountTotal, true)

  return (
    <>
      <Typ x="head">Who&apos;s coming?</Typ>
      <Typ x="p">
        <strong>{attd}</strong> have confirmed that they are attending.
        {event.responseSummary.headCountTotal === 0 &&
          ' Be the first by RSVPing below!'}
      </Typ>

      <ResponseDetails {...event} />
      <hr />
    </>
  )
}

const ResponseDetails = (event) => {
  if (!event.responses) return null
  if (event.responses.length === 0) return null

  return (
    <>
      <table className="table is-fullwidth is-hoverable is-bordered is-narrow">
        <thead>
          <tr>
            <th>Name</th>
            <th>Guests</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {event.responses.map((response, index) => (
            <tr key={index}>
              <td>{response.name}</td>
              <td>{response.headCount}</td>
              <td>{response.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Typ x="p">
        If your RSVP isn&apos;t appearing in the table above, double-check that
        you&apos;ve clicked the confirmation link in your email.
      </Typ>
    </>
  )
}

const ResponseSection = (event) => {
  if (event.responseConfig === 'DISABLED') return null

  return (
    <>
      <hr />
      <ResponseSummary {...event} />
      <NewResponseForm event={event} />
    </>
  )
}

const ShowEvent = ({ event }: Props) => {
  const { title, description, start, end, slug, timezone: _tz } = event
  const tz = _tz ?? 'UTC'
  const icsLink = `${globalThis.RWJS_API_URL}/downloadIcs?event=${slug}`
  const htmlDesc = markdownToHTML(description)

  return (
    <div className="mt-3">
      <Typ x="p" className="is-italic pb-5">
        The user-generated content below is not owned by Freevite. Please report
        abuse to <a href={`mailto:abuse@${SITE_HOST}`}>abuse@{SITE_HOST}</a>.
      </Typ>

      <hr />

      <Typ x="head">{title}</Typ>
      <Typ x="p">
        <strong>From:</strong> {prettyDate(start, tz)} ({prettyUntil(start)})
      </Typ>
      <Typ x="p">
        <strong>To:</strong> {prettyDate(end, tz)} ({prettyBetween(start, end)}{' '}
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

      <ResponseSection {...event} />
    </div>
  )
}

export default ShowEvent
