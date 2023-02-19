import classNames from 'classnames'
import * as R from 'remeda'
import { Entries } from 'type-fest'

const supportedClasses = ['input', 'textarea', 'checkbox'] as const
const classes = R.mapToObj(supportedClasses, (key) => [key, classNames(key)])

export const fieldAttrs = R.mapToObj(
  Object.entries(classes) as Entries<typeof classes>,
  ([key, value]) => [
    key,
    {
      className: value,
      errorClassName: classNames(value, 'is-danger'),
    },
  ]
)

export const formErrorAttrs = {
  wrapperClassName: classNames('has-text-weight-bold', 'has-text-danger'),
}
