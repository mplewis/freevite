import { useEffect, useState } from 'react'

import { prettyBetween, prettyDate, prettyUntil } from 'src/convert/date'
import { markdownToHTML } from 'src/convert/markdown'
import Typ from '../Typ/Typ'

export interface Props {
  event: {
    title: string
    description: string
    start: string
    end: string
  }
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
        The user-generated content below is not owned by Freevite. Please
        report abuse to{' '}
        <a href="mailto:abuse@freevite.com">abuse@freevite.com</a>.
      </Typ>
      <hr />
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
    </div>
  )
}

export default ShowEvent
