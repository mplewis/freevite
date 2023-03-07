import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import { SITE_HOST, SITE_URL } from 'src/app.config'
import Typ from 'src/components/Typ'

const HomePage = () => {
  return (
    <>
      <MetaTags
        title="Freevite – the simple event platform"
        description="Create event invites quickly and easily. Free forever, no signup required."
        ogContentUrl={`${SITE_URL}/og-logo.png`}
      />

      <div className="has-text-centered">
        <div className="my-6">
          <Typ x="head">Create event invitations for free</Typ>
          <Typ x="p">
            Freevite lets you create a calendar event with a short link to send
            to your friends.
          </Typ>
          <Typ x="p">
            We keep things simple. <strong>No accounts, no passwords</strong> –
            all you need is an email address.
          </Typ>

          <Link
            to={routes.newEvent()}
            className="button is-primary has-text-weight-bold mt-2 mb-3"
          >
            Create a new event
          </Link>

          <Typ x="p" className="is-italic">
            Trying to manage an existing event? Check your email inbox for the
            edit link.
          </Typ>
        </div>

        <hr />

        <div className="columns has-text-centered">
          <div className="column">
            <Typ x="subhead">Vanity URLs</Typ>
            <Typ x="p">
              Your event gets a URL that&apos;s short enough to send in a text
              message:
              <br />
              <code>{SITE_HOST}/event/my-party</code>
            </Typ>
          </div>
          <div className="column">
            <Typ x="subhead">iCal & GCal support</Typ>
            <Typ x="p">
              We support <strong>Google Calendar</strong> and{' '}
              <strong>Apple iCal</strong> invite formats, so your friends can
              easily add your event to their phone&apos;s calendar.
            </Typ>
          </div>
          <div className="column">
            <Typ x="subhead">Markdown support</Typ>
            <Typ x="p">
              Add <strong>styles to your text</strong> for <em>emphasis.</em>
              <br />
              Include{' '}
              <a
                href="https://www.youtube.com/watch?v=ygI-2F8ApUM"
                target="_blank"
                rel="noreferrer"
              >
                links to external websites.
              </a>
              <br />
              No more writing HTML by hand.
            </Typ>
          </div>
        </div>

        <hr />
      </div>

      <Typ x="head">FAQ</Typ>

      <Typ x="subhead">Why did you build Freevite?</Typ>
      <Typ x="p">
        I deleted my Facebook account in 2020, but I miss how easy it was to
        create an event and invite my friends online. I tried a few different
        e-vite solutions and found that none of them quite did what I wanted.
        The solution I was looking for would let me create an event, enter its
        details, and give me a short link to text to friends. So, I built
        Freevite.
      </Typ>

      <Typ x="subhead">How am I allowed to use Freevite?</Typ>
      <Typ x="p">
        Freevite is a service that I personally host and maintain for the free
        use of individuals to manage their own events. Abuse of these computing
        resources or misuse for other purposes (e.g. arbitrary data storage) is
        forbidden. I make a best effort to keep Freevite online, but I provide
        no uptime guarantees. I reserve the right to update the application
        without warning.
      </Typ>
      <Typ x="p">
        Freevite is an antifascist service. You are not allowed to use this
        service for events that promote racism, sexism, homophobia, transphobia,
        or any other form of bigotry. Violation of any of these rules will
        result in a permanent ban.
      </Typ>

      <Typ x="subhead">How do you manage my data?</Typ>
      <Typ x="p">
        I respect your right to privacy. I will never sell your data to a third
        party. I will never send you spam emails or share your email address
        with anyone. The only third-party analytics tool I use is{' '}
        <a href="https://sentry.io">Sentry</a> for the purpose of monitoring
        site health.
      </Typ>
    </>
  )
}

export default HomePage
