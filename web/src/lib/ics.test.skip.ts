import { generateICS, downloadICS, type Event } from './ics'

describe('generateICS', () => {
  const mockEvent: Event = {
    title: 'Test Event',
    description: 'This is a **test** event',
    start: '2020-01-01T00:00:00Z',
    end: '2020-01-01T01:00:00Z',
    location: 'Test Location',
  }

  it('generates valid ICS content', async () => {
    const icsContent = await generateICS(mockEvent)

    expect(icsContent).toContain('BEGIN:VCALENDAR')
    expect(icsContent).toContain('END:VCALENDAR')
    expect(icsContent).toContain('BEGIN:VEVENT')
    expect(icsContent).toContain('END:VEVENT')
  })

  it('includes event title in ICS content', async () => {
    const icsContent = await generateICS(mockEvent)
    expect(icsContent).toContain('SUMMARY:Test Event')
  })

  it('includes event location in ICS content', async () => {
    const icsContent = await generateICS(mockEvent)
    expect(icsContent).toContain('LOCATION:Test Location')
  })

  it('converts markdown description to plain text', async () => {
    const icsContent = await generateICS(mockEvent)
    expect(icsContent).toContain('DESCRIPTION:This is a test event')
  })

  it('handles empty location', async () => {
    const eventWithoutLocation = { ...mockEvent, location: '' }
    const icsContent = await generateICS(eventWithoutLocation)

    expect(icsContent).not.toContain('LOCATION:')
  })

  it('formats dates correctly in UTC', async () => {
    const icsContent = await generateICS(mockEvent)

    expect(icsContent).toContain('DTSTART:20200101T000000Z')
    expect(icsContent).toContain('DTEND:20200101T010000Z')
  })

  it('handles Date objects for start and end', async () => {
    const eventWithDates: Event = {
      ...mockEvent,
      start: new Date('2020-06-15T14:30:00Z'),
      end: new Date('2020-06-15T16:00:00Z'),
    }

    const icsContent = await generateICS(eventWithDates)

    expect(icsContent).toContain('DTSTART:20200615T143000Z')
    expect(icsContent).toContain('DTEND:20200615T160000Z')
  })

  it('converts dates with timezone offsets correctly', async () => {
    const eventWithOffset: Event = {
      ...mockEvent,
      start: '2020-01-01T00:00:00-06:00',
      end: '2020-01-01T01:00:00-06:00',
    }

    const icsContent = await generateICS(eventWithOffset)

    // -06:00 means the time is 6 hours behind UTC, so 00:00-06:00 = 06:00 UTC
    expect(icsContent).toContain('DTSTART:20200101T060000Z')
    expect(icsContent).toContain('DTEND:20200101T070000Z')
  })
})

describe('downloadICS', () => {
  const mockElement = {
    href: '',
    download: '',
    click: jest.fn(),
  }

  beforeEach(() => {
    // Mock DOM APIs
    global.URL = {
      createObjectURL: jest.fn(() => 'blob:mock-url'),
      revokeObjectURL: jest.fn(),
    } as unknown as typeof URL
    global.document.createElement = jest.fn((tag: string) => {
      if (tag === 'a') return mockElement
      return document.createElement(tag)
    }) as unknown as typeof document.createElement
    global.document.body = {
      appendChild: jest.fn(),
      removeChild: jest.fn(),
    } as unknown as HTMLBodyElement
    global.Blob = jest.fn(() => ({ size: 0 })) as unknown as typeof Blob
  })

  it('creates a blob with correct MIME type', () => {
    downloadICS('BEGIN:VCALENDAR...', 'Test Event')

    expect(Blob).toHaveBeenCalledWith(
      ['BEGIN:VCALENDAR...'],
      { type: 'text/calendar' }
    )
  })

  it('creates object URL for the blob', () => {
    const createObjectURLSpy = jest.spyOn(URL, 'createObjectURL')

    downloadICS('BEGIN:VCALENDAR...', 'Test Event')

    expect(createObjectURLSpy).toHaveBeenCalled()
  })

  it('sets download attribute with .ics extension', () => {
    downloadICS('BEGIN:VCALENDAR...', 'My Event')

    expect(mockElement.download).toBe('My Event.ics')
  })

  it('appends and removes anchor element to body', () => {
    downloadICS('BEGIN:VCALENDAR...', 'Test Event')

    expect(document.body.appendChild).toHaveBeenCalled()
    expect(document.body.removeChild).toHaveBeenCalled()
  })

  it('revokes object URL after download', () => {
    const revokeObjectURLSpy = jest.spyOn(URL, 'revokeObjectURL')

    downloadICS('BEGIN:VCALENDAR...', 'Test Event')

    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url')
  })

  it('clicks the anchor element to trigger download', () => {
    downloadICS('BEGIN:VCALENDAR...', 'Test Event')

    expect(mockElement.click).toHaveBeenCalled()
  })
})
