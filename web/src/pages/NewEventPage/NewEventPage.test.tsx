import { render } from '@redwoodjs/testing/web'

import NewEventPage from './NewEventPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('NewEventPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<NewEventPage />)
    }).not.toThrow()
  })
})
