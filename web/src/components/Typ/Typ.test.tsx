import { render } from '@redwoodjs/testing/web'

import Typ from './Typ'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Typ', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Typ />)
    }).not.toThrow()
  })
})
