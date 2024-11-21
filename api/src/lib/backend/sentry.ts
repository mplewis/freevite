import * as Sentry from '@sentry/serverless'

const dsn = process.env.SENTRY_DSN
if (!dsn) throw new Error('Missing required environment variable SENTRY_DSN')
Sentry.AWSLambda.init({ dsn })

export const wrap = Sentry.AWSLambda.wrapHandler
