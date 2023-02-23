import { render } from '@redwoodjs/testing/web'

import PageHead from './PageHead'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('PageHead', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PageHead />)
    }).not.toThrow()
  })
})
