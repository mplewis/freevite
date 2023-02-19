import { render } from '@redwoodjs/testing/web'

import PreviewEventPage from './PreviewEventPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('PreviewEventPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PreviewEventPage />)
    }).not.toThrow()
  })
})
