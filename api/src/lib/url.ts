import { SITE_HOST } from './config'

export function fqUrlForPath(path: string) {
  return `https://${SITE_HOST}${path}`
}
