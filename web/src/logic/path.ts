import { useLocation } from '@redwoodjs/router'

import { parseQueryString } from 'src/logic/url'

export function queryValues() {
  const { search } = useLocation()
  const [query] = React.useState(search)
  return parseQueryString(query)
}

export function queryValue(key) {
  return queryValues()[key]
}
