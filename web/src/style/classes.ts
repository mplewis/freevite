import classNames from 'classnames'
import * as R from 'remeda'
import { Entries } from 'type-fest'

const classes = {
  input: classNames('input'),
  textarea: classNames('textarea'),
}

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
