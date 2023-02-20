import classNames from 'classnames'
import { match } from 'ts-pattern'

export interface Props {
  x: 'head' | 'subhead' | 'p'
  className?: string
  children: React.ReactNode
}

const headClasses = ['mt-3', 'mb-1', 'has-text-weight-semibold']
const classes = {
  head: classNames('is-size-2', ...headClasses),
  subhead: classNames('is-size-4', ...headClasses),
  p: 'mb-2',
}

const Typ = ({ x, className, children, ...rest }: Props) => {
  const cn = classNames(classes[x], className)
  const attrs = { className: cn, ...rest }
  return match(x)
    .with('head', () => <h1 {...attrs}>{children}</h1>)
    .with('subhead', () => <h2 {...attrs}>{children}</h2>)
    .with('p', () => <p {...attrs}>{children}</p>)
    .exhaustive()
}
export default Typ
