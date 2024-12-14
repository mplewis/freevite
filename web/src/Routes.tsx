// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Route, Set } from '@redwoodjs/router'

import BaseLayout from './layouts/BaseLayout/BaseLayout'
import ConfirmResponsePage from './pages/EditResponsePage/EditResponsePage'

const Routes = () => {
  return (
    <Router>
      <Set wrap={BaseLayout}>
        <Route path="/" page={HomePage} name="home" prerender />
        <Route path="/new" page={NewEventPage} name="newEvent" prerender />
        <Route path="/created" page={EventCreatedPage} name="eventCreated" prerender />
        <Route path="/preview" page={PreviewEventPage} name="previewEvent" />
        <Route path="/event/{slug}" page={ViewEventPage} name="viewEvent" />

        {/* Below routes are used in email templates and cannot be changed */}
        <Route path="/edit" page={EditEventPage} name="editEvent" />
        <Route path="/rsvp" page={ConfirmResponsePage} name="confirmResponse" />
        <Route path="/unsubscribe" page={UnsubscribePage} name="unsubscribe" />
      </Set>
      <Route notfound page={NotFoundPage} prerender />
    </Router>
  )
}

export default Routes
