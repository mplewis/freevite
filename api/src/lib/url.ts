import { SITE_HOST } from '../app.config'

export function fqUrlForPath(path: string) {
  return `https://${SITE_HOST}${path}`
}
