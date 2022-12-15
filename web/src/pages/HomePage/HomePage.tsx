import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const HomePage = () => {
  return (
    <>
      <MetaTags title="Home" description="Home page" />
      <Link to={routes.newEvent()}>New Event</Link>
    </>
  )
}

export default HomePage
