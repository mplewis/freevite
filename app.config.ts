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

const protocol = SITE_HOST?.startsWith('localhost') ? 'http' : 'https'
export const SITE_URL = `${protocol}://${SITE_HOST}` as const

export const CI = process.env.NODE_ENV === 'test'
export const LOCALHOST = SITE_HOST.startsWith('localhost:')

export const S3_REGION = process.env.S3_REGION
export const S3_BUCKET = process.env.S3_BUCKET
export const S3_NAMESPACE = process.env.S3_NAMESPACE

export const RECAPTCHA_SERVER_KEY = process.env.RECAPTCHA_SERVER_KEY
export const RECAPTCHA_CLIENT_KEY = process.env.REDWOOD_ENV_RECAPTCHA_CLIENT_KEY
