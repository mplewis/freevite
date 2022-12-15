import { render } from '@redwoodjs/testing/web'

import EventForm from './EventForm'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('EventForm', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<EventForm />)
    }).not.toThrow()
  })
})
