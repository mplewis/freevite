export const CI = process.env.NODE_ENV === 'test'

// Netlify runtime context

const NETLIFY_DEPLOYED_CONTEXTS = [
  'production',
  'deploy-preview',
  'branch-deploy',
] as const
const NETLIFY_CONTEXTS = [...NETLIFY_DEPLOYED_CONTEXTS, 'dev'] as const

function validateContext(context: string | undefined): NetlifyContext {
  if (!context) throw new Error('Missing Netlify context')
  if (!NETLIFY_CONTEXTS.includes(context as NetlifyContext))
    throw new Error(`Invalid Netlify context: ${context}`)
  return context as NetlifyContext
}

type NetlifyContext = (typeof NETLIFY_CONTEXTS)[number]
const context = validateContext(process.env.CONTEXT)
export const IS_PRODUCTION = context === 'production'
export const IS_DEPLOYED = (
  [...NETLIFY_DEPLOYED_CONTEXTS] as string[]
).includes(context)

// Site host and URL

const extractAfterHTTPSMatcher = /^https:\/\/(.*)/
function extractAfterHTTPS(url?: string) {
  if (!url) return url
  const match = url.match(extractAfterHTTPSMatcher)
  if (match) return match[1]
  return url
}

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
