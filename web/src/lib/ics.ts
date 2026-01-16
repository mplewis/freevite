/**
 * Event data structure for ICS generation.
 */
export type Event = {
  title: string
  description: string
  start: string | Date
  end: string | Date
  location: string
}

type EventAttributes = {
  description: string
  title: string
  start: [number, number, number, number, number]
  end: [number, number, number, number, number]
  startInputType: 'utc' | 'local'
  startOutputType: 'utc' | 'local'
  endInputType: 'utc' | 'local'
  endOutputType: 'utc' | 'local'
  location?: string
}

/**
 * Convert a Date to the DateArray format expected by the ics library.
 */
function convertToDateArray(d: Date): [number, number, number, number, number] {
  return [
    d.getUTCFullYear(),
    d.getUTCMonth() + 1,
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
  ]
}

/**
 * Convert a Markdown string to plain text by parsing to HTML and sanitizing.
 */
async function markdownToText(markdown: string): Promise<string> {
  const { marked } = await import('marked')
  const sanitize = await import('sanitize-html')
  const html = await marked.parse(markdown)
  return sanitize.default(html, { allowedTags: [] })
}

/**
 * Convert an Event to the EventAttributes format required by the ics library.
 */
async function convertEvent(event: Event): Promise<EventAttributes> {
  const startDate = typeof event.start === 'string' ? new Date(event.start) : event.start
  const endDate = typeof event.end === 'string' ? new Date(event.end) : event.end

  const description = await markdownToText(event.description)
  const eventAttributes: EventAttributes = {
    description,
    title: event.title,
    start: convertToDateArray(startDate),
    end: convertToDateArray(endDate),
    startInputType: 'utc',
    startOutputType: 'utc',
    endInputType: 'utc',
    endOutputType: 'utc',
  }
  if (event.location !== '') eventAttributes.location = event.location
  return eventAttributes
}

/**
 * Build ICS content from EventAttributes using the ics library.
 */
async function buildICSEvent(attrs: EventAttributes): Promise<string> {
  const { createEvent } = await import('ics')
  return new Promise((resolve, reject) => {
    createEvent(attrs, (error: Error | null, value: string) => {
      if (error) reject(error)
      else resolve(value)
    })
  })
}

/**
 * Generate ICS file content from an event.
 */
export async function generateICS(event: Event): Promise<string> {
  const eventAttributes = await convertEvent(event)
  return buildICSEvent(eventAttributes)
}

/**
 * Trigger a browser download of ICS content as a .ics file.
 */
export function downloadICS(icsContent: string, filename: string) {
  const blob = new Blob([icsContent], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.ics`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
