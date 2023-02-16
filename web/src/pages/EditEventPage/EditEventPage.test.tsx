import { render } from '@redwoodjs/testing/web'

import EditEventPage from './EditEventPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('EditEventPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<EditEventPage />)
    }).not.toThrow()
  })
})
