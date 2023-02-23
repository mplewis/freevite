const extractAfterHTTPSMatcher = /^https:\/\/(.*)/
function extractAfterHTTPS(url?: string) {
  if (!url) return url
  const match = url.match(extractAfterHTTPSMatcher)
  if (match) return match[1]
  return url
}

export const SITE_HOST =
  extractAfterHTTPS(process.env.DEPLOY_PRIME_URL) || // Netlify deploy preview
  process.env.SITE_HOST // production
