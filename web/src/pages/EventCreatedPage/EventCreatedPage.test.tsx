import { render } from '@redwoodjs/testing/web'

import EventCreatedPage from './EventCreatedPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('EventCreatedPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<EventCreatedPage />)
    }).not.toThrow()
  })
})
