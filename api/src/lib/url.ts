export function fqUrlForPath(path: string) {
  return `https://${process.env.SITE_HOST}${path}`
}
