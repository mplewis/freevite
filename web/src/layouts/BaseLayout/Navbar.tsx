import { Link, routes } from '@redwoodjs/router'

export const Navbar = () => {
  let showLearn = false
  let showCreate = false
  try {
    showLearn = window.location.pathname.startsWith('/event/')
    showCreate = window.location.pathname === routes.home() || showLearn
  } catch (e) {
    // noop
  }
  return (
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
          <div className="navbar-item">
            {showLearn && (
              <Link to={routes.home()} className="button mx-1">
                Learn more
              </Link>
            )}
            {showCreate && (
              <Link
                to={routes.newEvent()}
                className="button is-primary has-text-weight-semibold mx-1"
              >
                Create an event
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

let registered = false

export function registerBurger() {
  if (registered) return

  document.addEventListener('DOMContentLoaded', () => {
    const burgers = Array.prototype.slice.call(
      document.querySelectorAll('.navbar-burger'),
      0
    )

    burgers.forEach((el) => {
      el.addEventListener('click', () => {
        const target = document.getElementById(el.dataset.target)
        el.classList.toggle('is-active')
        target.classList.toggle('is-active')
      })
    })
  })
  registered = true
}
