import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const HomePage = () => {
  return (
    <>
      <MetaTags title="Home" description="Home page" />

      <h1>HomePage</h1>

      <p>
        <Link to={routes.newEvent()}>NewEvent</Link>
      </p>
    </>
  )
}

export default HomePage
