import { render } from '@redwoodjs/testing/web'

import EditEventForm from './EditEventForm'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('EditEventForm', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<EditEventForm />)
    }).not.toThrow()
  })
})
