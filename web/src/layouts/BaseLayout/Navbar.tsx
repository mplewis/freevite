import { Link, routes } from '@redwoodjs/router'

export const Navbar = () => (
  <>
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link to={routes.home()} className="navbar-item logo">
          Freevite
        </Link>

        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a
          role="button"
          className="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbar-content"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbar-content" className="navbar-menu">
        <div className="navbar-start">
          <div className="navbar-item">
            The simple event platform – free forever.
          </div>
        </div>

        <div className="navbar-end">
          {window.location.pathname === routes.home() && (
            <div className="navbar-item">
              <Link
                to={routes.newEvent()}
                className="button is-primary has-text-weight-semibold"
              >
                Create an event
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  </>
)

export function registerBurger() {
  document.addEventListener('DOMContentLoaded', () => {
    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(
      document.querySelectorAll('.navbar-burger'),
      0
    )

    // Add a click event on each of them
    $navbarBurgers.forEach((el) => {
      el.addEventListener('click', () => {
        // Get the target from the "data-target" attribute
        const target = el.dataset.target
        const $target = document.getElementById(target)

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle('is-active')
        $target.classList.toggle('is-active')
      })
    })
  })
}
