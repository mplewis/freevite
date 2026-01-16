import { render as reactEmailRender } from '@react-email/render'

import { Mailer } from '@redwoodjs/mailer-core'
import { AbstractMailRenderer } from '@redwoodjs/mailer-core'
import type { MailRenderedContent, MailUtilities } from '@redwoodjs/mailer-core'
import { NodemailerMailHandler } from '@redwoodjs/mailer-handler-nodemailer'
import { RendererOptions } from '@redwoodjs/mailer-renderer-react-email'

import { MAIL_CONFIG } from 'src/api.config'
import { logger } from 'src/lib/backend/logger'

const { port, host, secure, auth } = MAIL_CONFIG

/** Dummy email renderer to send plain text email. Use with [`plain.tsx`](email/plain.tsx). */
class PlainEmailRenderer extends AbstractMailRenderer {
  render(
    template: Parameters<typeof reactEmailRender>[0],
    _options: RendererOptions,
    _utilities?: MailUtilities
  ): MailRenderedContent {
    const text = (template as { props?: { children?: string } }).props?.children ?? ''
    const html = null
    return { text, html }
  }

  internal(): Record<string, unknown> {
    return {}
  }
}

/** The RedwoodJS mailer transport. */
export const mailer = new Mailer({
  handling: {
    default: 'nodemailer',
    handlers: {
      nodemailer: new NodemailerMailHandler({
        transport: { port, host, secure, auth },
      }),
    },
  },

  rendering: {
    default: 'plain',
    renderers: {
      plain: new PlainEmailRenderer(),
    },
  },

  logger,
})
