import PageHead from 'src/components/PageHead/PageHead'
import Typ from 'src/components/Typ/Typ'
import { queryValues } from 'src/logic/path'

const EventCreatedPage = () => {
  const { title, email } = queryValues()

  return (
    <>
      <PageHead title="Event Created" desc="Your new event was created." />
      <Typ x="p">
        Your new event called <strong>{title.replaceAll('+', ' ')}</strong> has
        been created. Hooray! 🎉
      </Typ>
      <Typ x="p">
        We&apos;ve sent you an email at <code>{email}</code>. Please check your
        inbox and <strong>click the link</strong> we sent you to confirm your
        email address and fill out your event details. (Unconfirmed events are
        automatically deleted after 24 hours.)
      </Typ>
    </>
  )
}

export default EventCreatedPage
