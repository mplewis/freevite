# [Freevite](https://freevite.app)

Freevite is a service for managing events and sending invites to friends.

The [production instance](https://freevite.app) is free to use, and this code is open source if you want to learn how it works or host your own instance.

## Why is it called Freevite?

Free means free. I won't charge you to invite your friends to your Halloween party. Learn more on the [homepage](https://freevite.app).

# Architecture

This app is built on [RedwoodJS](https://redwoodjs.com/), a full-stack TypeScript framework. Check out the [readme](https://github.com/redwoodjs/redwood/blob/main/README.md) and [tutorial](https://docs.redwoodjs.com/docs/tutorial) to learn more about Redwood.

In production, I use the following stack:

- Hosting: [Netlify](https://www.netlify.com/)
- DB: Postgres via [neon.tech](https://neon.tech/)
- Outbound email: [AWS SES](https://aws.amazon.com/ses/)

This repo is set up with CI/CD which automatically deploys `main` to production.

## Development

Alias `rw` to make it easier to run commands: `alias rw='yarn redwood'`

- **Run the dev server:** `rw dev`
- **Regenerate types:** `rw g types`
  _This is usually done automatically while the dev server runs, but sometimes running this command helps get rid of red squiggles. Use it liberally._
- **Run tests:** `rw test`
- **Run type checks:** `rw type-check`
- **Run the same checks that CI does:** `yarn preflight`

## Environment Variables

Example values are provided in [.env.example](.env.example). Make a copy of that file named `.env`, then edit those values to set up your local development environment.

| Name                | Type   | Required? | Description                                                                                                                                |
| ------------------- | ------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| API_URL             | string |           | URL to the API server. When running locally, this should be `/.redwood/functions`. `redwood.toml` sets this to the Netlify value if unset. |
| DATABASE_URL        | string | yes       | The DB connection string which includes protocol, username, password, port, DB name, and options                                           |
| DISCORD_WEBHOOK_URL | string |           | If provided, send notifications for server events to this Discord channel via webhook                                                      |
| FROM_EMAIL          | string | yes       | The “from” address on outgoing emails                                                                                                      |
| FROM_NAME           | string | yes       | The human-readable “from” name on outgoing emails                                                                                          |
| LOCAL_CHROMIUM      | string |           | Path to the Chromium binary, used to generate Open Graph event preview images                                                              |
| SENTRY_DSN          | string | yes       | DSN URL for your Sentry project, where errors are reported                                                                                 |
| SITE_HOST           | string | yes       | The hostname of your Freevite instance, used in absolute URLs (e.g. email content)                                                         |
| SMTP_HOST           | string | yes       | Hostname for your SMTP outgoing mail server                                                                                                |
| SMTP_PASS           | string | yes       | Password for your SMTP outgoing mail server                                                                                                |
| SMTP_USER           | string | yes       | Username for your SMTP outgoing mail server                                                                                                |
| TEST_DATABASE_URL   | string |           | The connection string for the DB instance used when running tests. If not provided, defaults to `./.redwood/test.db`.                      |

# Contributions

Ideas for new features? Have something you want implemented? Let me know in a GitHub issue and I might put it on the [task backlog](NOTES.md).
