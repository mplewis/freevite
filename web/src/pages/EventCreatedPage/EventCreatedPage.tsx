import { MetaTags } from '@redwoodjs/web'

import { queryValues } from 'src/logic/path'

const EventCreatedPage = () => {
  const { title, email } = queryValues()

  return (
    <>
      <MetaTags title="EventCreated" description="EventCreated page" />

      <h1>Event Created</h1>
      <p>
        We&apos;ve created your event <strong>{title}</strong>. Please click the
        confirmation link in your <code>{email}</code> inbox to confirm your
        address and finish filling out your event details.
      </p>
    </>
  )
}

export default EventCreatedPage
