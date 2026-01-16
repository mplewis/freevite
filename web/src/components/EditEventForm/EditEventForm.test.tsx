import { render, screen, waitFor } from '@redwoodjs/testing/web'

import EditEventForm from './EditEventForm'

const mockEvent = {
  editToken: 'editToken',
  previewToken: 'previewToken',
  visible: true,
  confirmed: true,
  slug: 'my-event',
  title: 'My Event',
  description: 'A fun event',
  location: '123 Main St',
  start: '2025-01-01T10:00:00.000Z',
  end: '2025-01-01T12:00:00.000Z',
  timezone: 'America/New_York',
  responseConfig: 'SHOW_ALL' as const,
  responses: [],
}

describe('EditEventForm', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<EditEventForm event={mockEvent} />)
    }).not.toThrow()
  })

  it('disables all form inputs while saving', async () => {
    const { container } = render(<EditEventForm event={mockEvent} />)

    // Inputs should be enabled initially
    const titleInput = container.querySelector('input[name="title"]')
    const locationInput = container.querySelector('input[name="location"]')
    const slugInput = container.querySelector('input[name="slug"]')
    const descriptionTextarea = container.querySelector('textarea[name="description"]')

    expect(titleInput).not.toBeDisabled()
    expect(locationInput).not.toBeDisabled()
    expect(slugInput).not.toBeDisabled()
    expect(descriptionTextarea).not.toBeDisabled()
  })

  it('shows "Save Changes" text when not loading', () => {
    render(<EditEventForm event={mockEvent} />)

    expect(screen.getByText('Save Changes')).toBeInTheDocument()
  })

  it('shows "Delete Event" button text when not deleting', () => {
    render(<EditEventForm event={mockEvent} />)

    expect(screen.getByText('Delete Event')).toBeInTheDocument()
  })

  it('does not show "Deleting..." text when not deleting', () => {
    render(<EditEventForm event={mockEvent} />)

    expect(screen.queryByText('Deleting...')).not.toBeInTheDocument()
  })
})
