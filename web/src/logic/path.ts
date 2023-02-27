import { useLocation } from '@redwoodjs/router'

function parseQueryString(q: string): Record<string, string> {
  const query = q.replace(/^\?/, '')
  const pairs = query.split('&')
  const result: Record<string, string> = {}
  for (const pair of pairs) {
    const [key, value] = pair.split('=')
    result[key] = decodeURIComponent(value)
  }
  return result
}

/**
 * Parse the current location query string into a key-value map.
 * @returns The key-values for the current location query
 */
export function queryValues() {
  const { search } = useLocation()
  const [query] = React.useState(search)
  return parseQueryString(query)
}

/**
 * Fetch the value for a single key in the current location query string.
 * @param key The key to retrieve
 * @returns The value for the key, or undefined if the key was not found
 */
export function queryValue(key) {
  return queryValues()[key]
}
