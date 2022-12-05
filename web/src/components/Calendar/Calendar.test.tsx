import { render } from '@redwoodjs/testing/web'

import Calendar from './Calendar'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Calendar', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Calendar />)
    }).not.toThrow()
  })
})
