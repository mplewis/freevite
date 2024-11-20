import Announcement from 'src/components/Announcement/Announcement'
import { prerenderSafe } from 'src/logic/prerender'

import { Footer } from './Footer'
import { Navbar, registerBurger } from './Navbar'

type BaseLayoutProps = {
  children?: React.ReactNode
}

const currentAnnouncement =
  'We are currently encountering issues with our email provider. ' +
  'New events and RSVPs are impacted, ' +
  'but any email links you already have will still work. ' +
  "We're working to resolve the issue ASAP. Thank you for your patience!"

const BaseLayout = ({ children }: BaseLayoutProps) => {
  prerenderSafe(() => registerBurger())

  return (
    <>
      <div className="is-max-desktop container px-4 pb-4">
        <Navbar />
        <Announcement msg={currentAnnouncement} />
        {children}
        <Footer />
      </div>
    </>
  )
}

export default BaseLayout
