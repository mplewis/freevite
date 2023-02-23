import { Footer } from './Footer'
import { Navbar } from './Navbar'

type BaseLayoutProps = {
  children?: React.ReactNode
}

const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <>
      <div className="is-max-desktop container p-4">
        <Navbar />
        {children}
        <Footer />
      </div>
    </>
  )
}

export default BaseLayout
