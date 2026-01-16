import { render, screen } from '@redwoodjs/testing/web'

import DeleteButton from './DeleteButton'

describe('DeleteButton', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<DeleteButton text="Delete" onClick={() => {}} />)
    }).not.toThrow()
  })

  it('shows the provided text when not deleting or disabled', () => {
    render(<DeleteButton text="Delete Item" onClick={() => {}} />)

    expect(screen.getByText('Delete Item')).toBeInTheDocument()
  })

  it('shows "Deleting..." when deleting is true', () => {
    render(<DeleteButton text="Delete Item" onClick={() => {}} deleting={true} />)

    expect(screen.getByText('Deleting...')).toBeInTheDocument()
  })

  it('shows custom deleting text when provided', () => {
    render(
      <DeleteButton
        text="Delete Item"
        onClick={() => {}}
        deleting={true}
        deletingText="Removing..."
      />
    )

    expect(screen.getByText('Removing...')).toBeInTheDocument()
    expect(screen.queryByText('Deleting...')).not.toBeInTheDocument()
  })

  it('shows original text when disabled but not deleting', () => {
    render(<DeleteButton text="Delete Item" onClick={() => {}} disabled={true} />)

    expect(screen.getByText('Delete Item')).toBeInTheDocument()
    expect(screen.queryByText('Deleting...')).not.toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    render(<DeleteButton text="Delete Item" onClick={() => {}} disabled={true} />)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('is disabled when deleting prop is true', () => {
    render(<DeleteButton text="Delete Item" onClick={() => {}} deleting={true} />)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()

    render(<DeleteButton text="Delete Item" onClick={handleClick} />)

    const button = screen.getByText('Delete Item')
    button.click()

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn()

    render(
      <DeleteButton text="Delete Item" onClick={handleClick} disabled={true} />
    )

    const button = screen.getByText('Delete Item')
    button.click()

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('does not call onClick when deleting', () => {
    const handleClick = jest.fn()

    render(
      <DeleteButton text="Delete Item" onClick={handleClick} deleting={true} />
    )

    const button = screen.getByText('Deleting...')
    button.click()

    expect(handleClick).not.toHaveBeenCalled()
  })
})
