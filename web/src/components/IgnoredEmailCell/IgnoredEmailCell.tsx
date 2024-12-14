import type {
  IgnoredEmailQueryVariables,
  ResubscribeMutation,
  ResubscribeMutationVariables,
  UnsubscribeMutation,
  UnsubscribeMutationVariables,
} from 'types/graphql'

import { type CellFailureProps, useMutation } from '@redwoodjs/web'

import { queryValue } from 'src/logic/path'

import DeadEnd from '../DeadEnd/DeadEnd'
import Typ from '../Typ/Typ'

export const QUERY = gql`
  query IgnoredEmailQuery($input: IgnoredEmailInput!) {
    data: ignoredEmail(input: $input) {
      email
    }
  }
`

export const UNSUBSCRIBE_MUTATION = gql`
  mutation UnsubscribeMutation($input: IgnoredEmailInput!) {
    createIgnoredEmail(input: $input) {
      email
    }
  }
`

export const RESUBSCRIBE_MUTATION = gql`
  mutation ResubscribeMutation($input: IgnoredEmailInput!) {
    deleteIgnoredEmail(input: $input) {
      email
    }
  }
`

const ShowError = ({ error }: { error: Error }) => (
  <>
    <Typ x="p" className="has-text-danger">
      Error: {error.message}
    </Typ>
    <Typ x="p">
      Sorry, we&apos;re having trouble fulfilling your unsubscribe request.
      Please email{' '}
      <a href="mailto:support@freevite.com">support@freevite.com</a> and we will
      make sure you are permanently unsubscribed from our emails.
    </Typ>
  </>
)

const UnsubscribeForm = ({
  email,
  token,
}: {
  email: string
  token: string
}) => {
  const [save, { loading, error }] = useMutation<
    UnsubscribeMutation,
    UnsubscribeMutationVariables
  >(UNSUBSCRIBE_MUTATION, {
    refetchQueries: ['IgnoredEmailQuery'],
  })

  if (error) return <ShowError error={error} />

  return (
    <>
      <Typ x="p">
        Emails to <strong>{email}</strong> are currently{' '}
        <span className="has-text-weight-bold has-text-success">enabled.</span>
      </Typ>
      <Typ x="p">
        You are about to unsubscribe from <strong>all</strong> Freevite emails.
        After this, Freevite will not email you for <strong>any reason.</strong>{' '}
        This will prevent you from creating an event or RSVPing to an event, as
        we need to send you a confirmation link via email.
      </Typ>
      <Typ x="subhead">Unsubscribe</Typ>
      <Typ x="p">
        To confirm you want to unsubscribe, click the button below:
      </Typ>
      <button
        className="button is-danger"
        onClick={() => {
          save({ variables: { input: { email, token } } })
        }}
      >
        {loading ? 'Unsubscribing...' : 'Unsubscribe from all emails'}
      </button>
    </>
  )
}

const ResubscribeForm = ({
  email,
  token,
}: {
  email: string
  token: string
}) => {
  const [save, { loading, error }] = useMutation<
    ResubscribeMutation,
    ResubscribeMutationVariables
  >(RESUBSCRIBE_MUTATION, {
    refetchQueries: ['IgnoredEmailQuery'],
  })

  if (error) return <ShowError error={error} />

  return (
    <>
      <Typ x="p">
        Emails to <strong>{email}</strong> are currently{' '}
        <span className="has-text-weight-bold has-text-danger">disabled.</span>
      </Typ>
      <Typ x="p">
        Freevite will not email you for <strong>any reason.</strong> This will
        prevent you from creating an event or RSVPing to an event, as we need to
        send you a confirmation link via email.
      </Typ>
      <Typ x="subhead">Resubscribe</Typ>
      <Typ x="p">
        If you want to start receiving Freevite emails again, click the button
        below:
      </Typ>
      <button
        className="button is-success"
        onClick={() => {
          save({ variables: { input: { email, token } } })
        }}
      >
        {loading ? 'Resubscribing...' : 'Start receiving emails again'}
      </button>
    </>
  )
}

export const Loading = () => <div>Loading...</div>

export const Failure = ({
  error,
}: CellFailureProps<IgnoredEmailQueryVariables>) => {
  console.error({ error })
  return (
    <DeadEnd
      title="Something went wrong"
      desc={[
        "Sorry, we weren't able to process your request due to a technical issue.",
        'Please contact us at support@freevite.com for assistance.',
      ]}
      c2a={{ text: 'Go home', to: '/' }}
    />
  )
}

export const Empty = () => (
  <UnsubscribeForm email={queryValue('email')} token={queryValue('token')} />
)

export const Success = () => (
  <ResubscribeForm email={queryValue('email')} token={queryValue('token')} />
)
