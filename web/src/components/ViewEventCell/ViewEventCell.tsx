import dayjs from 'dayjs'
import { ViewEventQuery } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Calendar from '../Calendar/Calendar'

export const QUERY = gql`
  query ViewEventQuery($slug: String!) {
    event: eventBySlug(slug: $slug) {
      id
      token
      confirmed
      expiresAt
      visible
      slug
      title
      description
      start
      end
      reminders
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ event }: CellSuccessProps<ViewEventQuery>) => {
  const { start } = event
  const s = dayjs(start)
  const month = s.format('MMM')
  const day = s.format('D')
  const time = s.format('h:mm A')

  return (
    <>
      <pre>
        <code>{JSON.stringify(event, null, 2)}</code>
      </pre>
      <Calendar month={month} day={day} time={time} />
    </>
  )
}
