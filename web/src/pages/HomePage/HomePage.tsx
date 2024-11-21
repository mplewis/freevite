import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { SITE_HOST, SITE_URL } from 'src/apiLibShared/shared.config'
import Typ from 'src/components/Typ'

const HomePage = () => {
  return (
    <>
      <Metadata
        title="The simple event platform"
        description="Create event invites and collect RSVPs. Free forever, no signup required."
        og={{ image: `${SITE_URL}/og-logo.png` }}
      />

      <div className="has-text-centered">
        <div className="my-6">
          <Typ x="head">Create event invitations for free</Typ>
          <Typ x="p">
            Freevite lets you create an event, invite people with a short link,
            and collect RSVPs.
          </Typ>
          <Typ x="p">
            <strong>No accounts, no passwords, no ads</strong> – all you need is
            an email address.
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

        <Typ x="subhead">Why use Freevite for your next event?</Typ>
        <Typ x="p">
          Here is what our <em>totally free</em> service has to offer:
        </Typ>

        <div className="columns has-text-centered">
          <div className="column">
            <div className="mb-5">
              <Typ x="subhead">Vanity URLs</Typ>
              <Typ x="p">
                Your event link is short enough to send by text:
                <br />
                <code>{SITE_HOST}/event/my-party</code>
              </Typ>
            </div>
            <div>
              <Typ x="subhead">RSVPs</Typ>
              <Typ x="p">
                Collect responses and know how many people plan on attending.
                Guests don&apos;t need to create an account - all they need is
                an email address.
              </Typ>
            </div>
          </div>
          <div className="column">
            <div className="mb-5">
              <Typ x="subhead">Calendar support</Typ>
              <Typ x="p">
                We support <strong>Google Calendar</strong> and{' '}
                <strong>Apple iCal</strong> invite formats, so your friends can
                easily add your event to their phone&apos;s calendar.
              </Typ>
            </div>
            <div>
              <Typ x="subhead">Edit in Markdown</Typ>
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

      <Typ x="subhead">
        What do you mean by <em>free forever?</em>
      </Typ>
      <Typ x="p">
        As the internet keeps becoming centralized and privatized, it becomes
        harder and harder to find simple services that just do the thing you
        want without trying to drain your wallet or show you dozens of ads. I
        want Freevite to be the place where you can create an event for your
        friends, text them a link, and find out who&apos;s attending, without
        having to pay anyone money just for using a computer.
      </Typ>
      <Typ x="p">
        In my day job, I&apos;m an infrastructure engineer who builds
        applications that scale in the cloud. Outside of work, I use my skills
        to keep this service running as frugally as possible. Freevite is only
        hosting text content and sending email, which makes it exceptionally
        cheap to run. I&apos;m committed to running Freevite for free for
        everyone as long as I can.
      </Typ>
      <Typ x="p">
        If I add paid features to Freevite in the future, I will ensure that the
        core product remains free to use for everyone. You will always be able
        to create an event and invite your friends here on Freevite.
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
