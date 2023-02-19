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

const Routes = () => {
  return (
    <Router>
      <Set wrap={BaseLayout}>
        <Route path="/" page={HomePage} name="home" />
        <Route path="/new" page={NewEventPage} name="newEvent" />
        <Route path="/created" page={EventCreatedPage} name="eventCreated" />
        <Route path="/edit" page={EditEventPage} name="editEvent" />
        <Route path="/preview" page={PreviewEventPage} name="previewEvent" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
