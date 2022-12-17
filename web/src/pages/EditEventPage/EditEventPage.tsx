import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const EditEventPage = () => {
  return (
    <>
      <MetaTags title="EditEvent" description="EditEvent page" />

      <h1>EditEventPage</h1>
      <p>
        Find me in <code>./web/src/pages/EditEventPage/EditEventPage.tsx</code>
      </p>
      <p>
        My default route is named <code>editEvent</code>, link to me with `
        <Link to={routes.editEvent()}>EditEvent</Link>`
      </p>
    </>
  )
}

export default EditEventPage
