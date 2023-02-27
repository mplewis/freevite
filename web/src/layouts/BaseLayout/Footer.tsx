const bits = [
  <>
    <a href="mailto:hi@freevite.app">Contact us</a>
  </>,
  <>
    View on{' '}
    <a
      href="https://github.com/mplewis/freevite"
      target="_blank"
      rel="noreferrer"
    >
      GitHub
    </a>
  </>,
  <>
    Created by{' '}
    <a href="https://mplewis.com" target="_blank" rel="noreferrer">
      Matt Lewis
    </a>
  </>,
  <>
    Read my{' '}
    <a href="https://kesdev.com" target="_blank" rel="noreferrer">
      engineering blog
    </a>
  </>,
]

export const Footer = () => (
  <footer className="py-6">
    <div className="content has-text-centered">
      {bits.map((bit, i) => (
        <span key={i}>
          <span className="mx-3">{bit}</span>
          {i < bits.length - 1 && '|'}
        </span>
      ))}
    </div>
  </footer>
)
