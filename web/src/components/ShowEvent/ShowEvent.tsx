import { useEffect, useState } from 'react'

import { prettyBetween, prettyDate, prettyUntil } from 'src/convert/date'
import { markdownToHTML } from 'src/convert/markdown'

export interface Props {
  event: {
    ownerEmail: string
    title: string
    description: string
    start: string
    end: string
  }
}

const ShowEvent = ({ event }: Props) => {
  const { ownerEmail, title, description, start, end } = event
  const [htmlDesc, setHtmlDesc] = useState<string>(
    '<em>Rendering Markdown description...</em>'
  )
  useEffect(() => {
    markdownToHTML(description).then(setHtmlDesc)
  }, [description])
  return (
    <div>
      <h1 className="is-size-3 has-text-weight-bold mb-3">{title}</h1>
      <p className="mb-3">
        <strong>From:</strong> {prettyDate(start)} ({prettyUntil(start)})
      </p>
      <p className="mb-3">
        <strong>To:</strong> {prettyDate(end)} ({prettyBetween(start, end)}{' '}
        long)
      </p>
      <p>Add to Google Calendar</p>
      <p>Add to iCal</p>
      <hr />
      <p className="content" dangerouslySetInnerHTML={{ __html: htmlDesc }} />
      <hr />
      <em>
        <p>
          The above event was created by{' '}
          <a href={`mailto:${ownerEmail}`} target="_blank" rel="noreferrer">
            {ownerEmail}
          </a>
          .
        </p>
        <p>
          Freevite is not associated with any user-generated content. Please
          report abuse to{' '}
          <a href="mailto:abuse@freevite.com">abuse@freevite.com</a>.
        </p>
      </em>
    </div>
  )
}

export default ShowEvent
