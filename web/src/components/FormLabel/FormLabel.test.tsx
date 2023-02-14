import { render } from '@redwoodjs/testing/web'

import FormLabel from './FormLabel'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('FormLabel', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<FormLabel />)
    }).not.toThrow()
  })
})
