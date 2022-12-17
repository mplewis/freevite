import { render } from '@redwoodjs/testing/web'

import EventDetails from './EventDetails'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('EventDetails', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<EventDetails />)
    }).not.toThrow()
  })
})
