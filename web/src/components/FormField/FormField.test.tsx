import { render } from '@redwoodjs/testing/web'

import FormField from './FormField'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('FormLabel', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<FormField />)
    }).not.toThrow()
  })
})
