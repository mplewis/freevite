import * as Sentry from '@sentry/react'

function main() {
  const SENTRY_DSN =
    process.env.SENTRY_DSN ||
    // HACK: Redwood+Netlify doesn't seem to be obeying our `includeEnvironmentVariables` setting
    process.env.REDWOOD_ENV_SENTRY_DSN

  if (!SENTRY_DSN) {
    console.error(
      'Missing SENTRY_DSN environment variable. Sentry is disabled for now.'
    )
    return
  }

  const dsn = SENTRY_DSN
  const environment = process.env.NODE_ENV

  Sentry.init({
    dsn,
    environment,
    integrations: [new Sentry.BrowserTracing()],
    tracesSampleRate: 1.0,
  })

  console.log('Sentry initialized', {
    dsn,
    environment,
    processEnv: process.env,
  })
}

main()

export default Sentry
