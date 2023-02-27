import { SITE_HOST } from '../app.config'

/**
 * Generate a fully-qualified URL for the given path.
 * @param path The path in question
 * @returns The URL with `https://` and the hostname prefixed
 */
export function fqUrlForPath(path: string) {
  return `https://${SITE_HOST}${path}`
}
