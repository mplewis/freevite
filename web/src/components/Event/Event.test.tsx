import { render } from '@redwoodjs/testing/web'

import Event from './Event'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Event', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Event />)
    }).not.toThrow()
  })
})
