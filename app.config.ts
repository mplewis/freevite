type NetlifyContext = 'production' | 'deploy-preview' | 'branch-deploy' | 'dev'

const extractAfterHTTPSMatcher = /^https:\/\/(.*)/

function extractAfterHTTPS(url?: string) {
  if (!url) return url
  const match = url.match(extractAfterHTTPSMatcher)
  if (match) return match[1]
  return url
}

const context: NetlifyContext = process.env.CONTEXT as NetlifyContext
export let SITE_HOST = process.env.SITE_HOST
if (context === 'deploy-preview' || context === 'branch-deploy')
  SITE_HOST = extractAfterHTTPS(process.env.DEPLOY_PRIME_URL)

export const CI = process.env.NODE_ENV === 'test'
