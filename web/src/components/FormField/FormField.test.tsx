import { Form } from '@redwoodjs/forms'
import { render } from '@redwoodjs/testing/web'

import FormField from './FormField'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('FormLabel', () => {
  it('renders successfully', () => {
    expect(() => {
      render(
        <Form>
          <FormField name='name' text='text'>
            <input name='some-input' />
          </FormField>
        </Form>
      )
    }).not.toThrow()
  })
})
