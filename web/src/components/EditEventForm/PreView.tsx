import { Link, routes } from '@redwoodjs/router'
import { useState } from 'react'

import { fqUrlForPath } from 'src/apiLibShared/url'

import Typ from '../Typ/Typ'

export interface Props {
  isPublic: boolean
  dirty: boolean
  slug: string
  previewToken: string
}

export const PreView = ({ isPublic, dirty, slug, previewToken }: Props) => {
  const eventLink = routes.viewEvent({ slug })
  const fqEventLink = fqUrlForPath(eventLink)
  const [copied, setCopied] = useState(false)

  const copyLink = () => {
    navigator.clipboard.writeText(fqEventLink).then(() => setCopied(true))
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <>
      <Typ x='p'>
        Your event is currently <strong>{isPublic ? 'visible' : 'NOT visible'}</strong> to the
        public
        {isPublic && (
          <>
            {' '}
            at
            <a href={eventLink} target='_blank' rel='noreferrer'>
              <code>{fqEventLink}</code>
            </a>
          </>
        )}
        .
      </Typ>
      <Typ x='p'>
        {isPublic && (
          <>
            <a href={eventLink} className='button is-primary' target='_blank' rel='noreferrer'>
              Go to the event page &raquo;
            </a>
            <button className='button ml-2' onClick={copyLink} disabled={copied}>
              {copied ? 'Event link copied!' : 'Copy link to event'}
            </button>
          </>
        )}
      </Typ>

      <Typ x='p'>See how your event looks before making it public:</Typ>
      <Typ x='p'>
        {dirty ? (
          <button className='button' disabled>
            To preview, save your changes &raquo;
          </button>
        ) : (
          <Link to={routes.previewEvent({ token: previewToken })} className='button'>
            Preview this event &raquo;{' '}
          </Link>
        )}
      </Typ>
    </>
  )
}
