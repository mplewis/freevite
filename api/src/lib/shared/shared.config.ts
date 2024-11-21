export const CI = process.env.NODE_ENV === 'test'

type NetlifyContext = 'production' | 'deploy-preview' | 'branch-deploy' | 'dev'
const context: NetlifyContext = process.env.CONTEXT as NetlifyContext

const extractAfterHTTPSMatcher = /^https:\/\/(.*)/

function extractAfterHTTPS(url?: string) {
  if (!url) return url
  const match = url.match(extractAfterHTTPSMatcher)
  if (match) return match[1]
  return url
}

// Site host and URL

export let SITE_HOST = process.env.SITE_HOST
if (context === 'deploy-preview' || context === 'branch-deploy')
  SITE_HOST = extractAfterHTTPS(process.env.DEPLOY_PRIME_URL)

const protocol = SITE_HOST?.startsWith('localhost') ? 'http' : 'https'
if (!SITE_HOST) throw new Error('SITE_HOST is required')
export const SITE_URL = `${protocol}://${SITE_HOST}` as const
export const LOCALHOST = SITE_HOST.startsWith('localhost:')

// S3

export const S3_REGION = process.env.S3_REGION
export const S3_BUCKET = process.env.S3_BUCKET
export const S3_NAMESPACE = process.env.S3_NAMESPACE

// Recaptcha

export const RECAPTCHA_CLIENT_KEY = process.env.REDWOOD_ENV_RECAPTCHA_CLIENT_KEY
