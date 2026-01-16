import { useSentry } from '@envelop/sentry'

import { createGraphQLHandler } from '@redwoodjs/graphql-server'

import directives from 'src/directives/**/*.{js,ts}'
import sdls from 'src/graphql/**/*.sdl.{js,ts}'
import { logger } from 'src/lib/backend/logger'
import { wrap } from 'src/lib/backend/sentry'
import { db } from 'src/lib/db'
import services from 'src/services/**/*.{js,ts}'

const baseHandler = createGraphQLHandler({
  loggerConfig: { logger, options: {} },
  directives,
  sdls,
  services,
  extraPlugins: [useSentry()],
  onException: () => {
    // Disconnect from your database with an unhandled exception.
    db.$disconnect()
  },
})

export const handler = wrap(baseHandler)
