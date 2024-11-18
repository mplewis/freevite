import { useState, useEffect } from 'react'

import { useAtom } from 'jotai/react'
import pluralize from 'pluralize'
import { PublicEvent } from 'types/graphql'

import {
  prettyEndWithBetween,
  prettyStartWithUntil,
} from 'src/apiLib/convert/date'
import { markdownToHTML } from 'src/apiLib/markdown'
import { eventPreviewImagePublicURL } from 'src/apiLib/url'
import { SITE_HOST } from 'src/app.config'
import { responseTokenAtom } from 'src/data/atoms'
import { scrollTo } from 'src/logic/scroll'

import CalButtons from '../CalButtons/CalButtons'
import NewResponseForm from '../NewResponseForm/NewResponseForm'
import PageHead from '../PageHead/PageHead'
import { ResponseDetails } from '../ResponseDetails/ResponseDetails'
import Typ from '../Typ/Typ'

export interface Props {
  event: PublicEvent
  preview?: boolean // Don't use real event page title if it's just a preview
}

const RSVPButton = ({
  event,
  responseToken,
}: {
  event: PublicEvent
  responseToken?: string
}) => {
  if (responseToken) return null
  if (event.responseConfig === 'DISABLED') return null

  return (
    <button
      className="button is-primary has-text-weight-semibold"
      style={{ height: '47px' }}
      onClick={() => scrollTo('rsvp-form')}
    >
      RSVP Now &raquo;
    </button>
  )
}

const ResponseSummary = ({ event }: { event: PublicEvent }) => {
  if (!event.responseSummary) return null

  const attd = pluralize('person', event.responseSummary.headCountTotal, true)
  const poss = event.responseSummary.headCountTotal === 1 ? 'has' : 'have'

  return (
    <>
      <Typ x="subhead">Who&apos;s coming?</Typ>
      <Typ x="p">
        <strong>{attd}</strong> {poss} confirmed that they are attending.
        {event.responseSummary.headCountTotal === 0 &&
          ' Be the first by RSVPing below!'}
      </Typ>

      <ResponseDetails responses={event.responses} />
      <hr />
    </>
  )
}

const ResponseSection = ({
  event,
  responseToken,
}: {
  event: PublicEvent
  responseToken?: string
}) => {
  if (event.responseConfig === 'DISABLED') return null

  return (
    <>
      <hr />
      <ResponseSummary event={event} />
      <div id="rsvp-form">
        <NewResponseForm event={event} responseToken={responseToken} />
      </div>
    </>
  )
}

const ShowEvent = ({ event, preview }: Props) => {
  const { description, location, start, end, timezone: _tz } = event
  const tz = _tz ?? 'UTC'
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${location}`

  const [htmlDesc, setHTMLDesc] = useState('')
  useEffect(() => {
    ;(async () => {
      const htmlDesc = await markdownToHTML(description)
      setHTMLDesc(htmlDesc)
    })()
  }, [description])

  const eventID = event.id.toString()
  const [tokens] = useAtom(responseTokenAtom)
  const responseToken = tokens[eventID]

  return (
    <div className="mt-3">
      <Typ x="p" className="is-italic">
        The user-generated content below is not owned by Freevite. Please report
        abuse to <a href={`mailto:abuse@${SITE_HOST}`}>abuse@{SITE_HOST}</a>.
      </Typ>

      <hr />

      {preview ? (
        <Typ x="head">{event.title}</Typ>
      ) : (
        <PageHead
          title={event.title}
          desc={event.description.slice(0, 80)}
          ogImage={eventPreviewImagePublicURL(event.slug)}
        />
      )}
      <Typ x="p">
        <strong>From:</strong> {prettyStartWithUntil(start, tz)}
      </Typ>
      <Typ x="p">
        <strong>To:</strong> {prettyEndWithBetween(start, end, tz)}
      </Typ>
      {location !== '' && (
        <Typ x="p">
          <strong>Location:</strong>{' '}
          <a href={mapHref} target="_blank" rel="noreferrer">
            {location}
          </a>
        </Typ>
      )}
      <div className="mt-4 mb-4">
        <div className="mb-4">
          <RSVPButton event={event} responseToken={responseToken} />
        </div>
        <CalButtons event={event} htmlDesc={htmlDesc} />
      </div>
      <div
        className="content pb-2"
        dangerouslySetInnerHTML={{ __html: htmlDesc }}
      />

      <ResponseSection event={event} responseToken={responseToken} />
    </div>
  )
}

export default ShowEvent
