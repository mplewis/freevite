import { render } from '@redwoodjs/testing/web'

import ShowEvent from './ShowEvent'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ShowEvent', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ShowEvent />)
    }).not.toThrow()
  })
})
