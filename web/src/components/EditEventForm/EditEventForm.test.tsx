import { render } from '@redwoodjs/testing/web'

import EditEventForm from './EditEventForm'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('EditEventForm', () => {
  it('renders successfully', () => {
    expect(() => {
      render(
        <EditEventForm
          event={{
            editToken: 'editToken',
            previewToken: 'previewToken',
            visible: true,
            confirmed: true,
            slug: 'slug',
            title: 'title',
            description: 'description',
            location: '',
            start: '2021-01-01T00:00:00.000Z',
            end: '2021-01-01T00:00:00.000Z',
            responseConfig: 'DISABLED',
            responses: [],
            notiResponseCreated: true,
            notiResponseUpdated: true,
            notiResponseDeleted: true,
          }}
        />
      )
    }).not.toThrow()
  })
})
