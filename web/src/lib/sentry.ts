import * as Sentry from '@sentry/react'

import { IS_DEPLOYED } from 'src/apiLibShared/shared.config'

function main() {
  if (!IS_DEPLOYED) return

  const environment = process.env.REDWOOD_ENV_SENTRY_ENV || process.env.NODE_ENV
  // HACK: Redwood+Netlify doesn't seem to be obeying our `includeEnvironmentVariables` setting
  const dsn = process.env.SENTRY_DSN || process.env.REDWOOD_ENV_SENTRY_DSN
  if (!dsn) {
    console.error(
      'Missing SENTRY_DSN environment variable. Sentry is disabled.'
    )
    return
  }

  Sentry.init({
    dsn,
    environment,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 1.0,
  })
}

main()

export default Sentry
