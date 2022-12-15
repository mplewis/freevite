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
        <Route notfound page={NotFoundPage} />
        <Route path="/" page={HomePage} name="home" />
        <Route path="/new-event" page={NewEventPage} name="newEvent" />
      </Set>
    </Router>
  )
}

export default Routes
