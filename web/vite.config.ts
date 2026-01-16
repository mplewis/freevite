import redwood from '@redwoodjs/vite'

import { sentryVitePlugin } from '@sentry/vite-plugin'
import dns from 'dns'
import { defineConfig, type UserConfig } from 'vite'

// See: https://vitejs.dev/config/server-options.html#server-host
// So that Vite will load on local instead of 127.0.0.1
dns.setDefaultResultOrder('verbatim')

/**
 * https://vitejs.dev/config/
 * @type {import('vite').UserConfig}
 */
const viteConfig: UserConfig = {
  build: { sourcemap: true },
  plugins: [
    redwood(),
    sentryVitePlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'kesdev',
      project: 'freevite',
    }),
  ],
}

export default defineConfig(viteConfig)
