import { prerenderSafe } from 'src/logic/prerender'

import { Footer } from './Footer'
import { Navbar, registerBurger } from './Navbar'

type BaseLayoutProps = {
  children?: React.ReactNode
}

const BaseLayout = ({ children }: BaseLayoutProps) => {
  prerenderSafe(() => registerBurger())

  return (
    <>
      <div className='is-max-desktop container px-4 pb-4'>
        <Navbar />
        {children}
        <Footer />
      </div>
    </>
  )
}

export default BaseLayout
