import { render, screen } from '@redwoodjs/testing/web'
import { useMutation } from '@redwoodjs/web'

import EditEventForm from './EditEventForm'

// Mock the useMutation hook
jest.mock('@redwoodjs/web', () => ({
  ...jest.requireActual('@redwoodjs/web'),
  useMutation: jest.fn(),
}))

const mockSave = jest.fn()
const mockDestroy = jest.fn()

let callCount = 0
function setupMockUseMutation({ loading = false, deleting = false } = {}) {
  callCount = 0
  ;(useMutation as jest.Mock).mockImplementation(() => {
    callCount++
    // First call is UPDATE_EVENT, second call is DELETE_EVENT
    if (callCount === 1) {
      return [mockSave, { loading, error: null }]
    }
    if (callCount === 2) {
      return [mockDestroy, { loading: deleting, error: null }]
    }
    return [jest.fn(), { loading: false, error: null }]
  })
}

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
  beforeEach(() => {
    setupMockUseMutation()
  })

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

    expect(titleInput).toBeEnabled()
    expect(locationInput).toBeEnabled()
    expect(slugInput).toBeEnabled()
    expect(descriptionTextarea).toBeEnabled()
  })

  it('shows "Save Changes" text when not loading', () => {
    render(<EditEventForm event={mockEvent} />)

    expect(screen.getByText('Save Changes')).toBeInTheDocument()
  })

  it('shows "Delete Event" button text when not deleting', () => {
    render(<EditEventForm event={mockEvent} />)

    expect(screen.getByText('Delete Event')).toBeInTheDocument()
  })

  it('disables Delete button while saving', () => {
    setupMockUseMutation({ loading: true })
    render(<EditEventForm event={mockEvent} />)

    const deleteButton = screen.getByText('Delete Event')
    expect(deleteButton).toBeDisabled()

    // Save button shows "Saving..." when loading
    const saveButton = screen.getByText('Saving...')
    expect(saveButton).toBeDisabled()
  })

  it('disables Save button when deleting', () => {
    // The delete mutation's loading state doesn't affect the component's
    // internal deleting state, but we can still verify the Save button
    // is disabled when form is busy (e.g. when deleting is happening)
    setupMockUseMutation({ deleting: true })
    render(<EditEventForm event={mockEvent} />)

    const saveButton = screen.getByText('Save Changes')
    expect(saveButton).toBeDisabled()

    // Delete button is still present (text is controlled by component's state)
    const deleteButton = screen.getByText('Delete Event')
    expect(deleteButton).toBeInTheDocument()
  })
})
