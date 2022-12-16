// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Route, Set } from '@redwoodjs/router'

import ScaffoldLayout from 'src/layouts/ScaffoldLayout'

import BaseLayout from './layouts/BaseLayout/BaseLayout'

const Routes = () => {
  return (
    <Router>
      <Set wrap={ScaffoldLayout} title="Events" titleTo="events" buttonLabel="New Event" buttonTo="newEvent">
        <Route path="/events/new" page={EventNewEventPage} name="newEvent" />
        <Route path="/events/{id:Int}/edit" page={EventEditEventPage} name="editEvent" />
        <Route path="/events/{id:Int}" page={EventEventPage} name="event" />
        <Route path="/events" page={EventEventsPage} name="events" />
      </Set>
      <Set wrap={BaseLayout}>
        <Route notfound page={NotFoundPage} />
        <Route path="/" page={HomePage} name="home" />
        {/* <Route path="/new-event" page={NewEventPage} name="newEvent" /> */}
      </Set>
    </Router>
  )
}

export default Routes
