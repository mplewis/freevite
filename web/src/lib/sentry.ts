import * as Sentry from '@sentry/react'

let dsn = ''
let environment = 'development'

// HACK: I think this helps the build rewrite find the env var
const SENTRY_DSN = process.env.SENTRY_DSN || process.env.REDWOOD_ENV_SENTRY_DSN

console.log({ SENTRY_DSN, env: process.env })

if (typeof process === 'undefined' || !SENTRY_DSN) {
  console.error(
    'Missing SENTRY_DSN environment variable. Did you forget to add it to ' +
      'your redwood.toml file in `includeEnvironmentVariables`?'
  )
  console.info(`Copy this into your redwood.toml file:`)
  console.info(`
  includeEnvironmentVariables = [
    "SENTRY_DSN"
  ]

  `)
  console.error('Sentry is disabled for now')
} else {
  dsn = SENTRY_DSN
  environment = process.env.NODE_ENV
}

Sentry.init({
  dsn,
  environment,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
})

export default Sentry
