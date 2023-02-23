export function parseQueryString(q: string): Record<string, string> {
  const query = q.replace(/^\?/, '')
  const pairs = query.split('&')
  const result: Record<string, string> = {}
  for (const pair of pairs) {
    const [key, value] = pair.split('=')
    result[key] = decodeURIComponent(value)
  }
  return result
}
