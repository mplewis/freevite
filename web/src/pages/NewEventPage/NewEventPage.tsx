import {
  CreateEventMutation,
  CreateEventMutationVariables,
} from 'types/graphql'

import {
  Form,
  TextField,
  EmailField,
  FormError,
  Submit,
} from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { MetaTags, useMutation } from '@redwoodjs/web'

import { fieldAttrs } from 'src/classes'
import FormLabel from 'src/components/FormLabel/FormLabel'

interface FormValues {
  ownerEmail: string
  title: string
}

const CREATE_EVENT = gql`
  mutation CreateEventMutation($input: CreateEventInput!) {
    createEvent(input: $input) {
      ownerEmail
      title
    }
  }
`

const NewEventPage = () => {
  const [create, { loading, error }] = useMutation<
    CreateEventMutation,
    CreateEventMutationVariables
  >(CREATE_EVENT, {
    onCompleted: (data) => {
      const { ownerEmail, title } = data.createEvent
      navigate(routes.eventCreated({ email: ownerEmail, title }))
    },
  })

  return (
    <>
      <MetaTags title="NewEvent" description="NewEvent page" />

      <h1>NewEventPage</h1>

      <Form onSubmit={(input: FormValues) => create({ variables: { input } })}>
        <FormError error={error} wrapperClassName="form-error" />

        <FormLabel name="ownerEmail" text="Email Address">
          <EmailField
            name="ownerEmail"
            validation={{ required: true }}
            {...fieldAttrs}
          />
        </FormLabel>

        <FormLabel name="title" text="Title">
          <TextField
            name="title"
            validation={{ required: true }}
            {...fieldAttrs}
          />
        </FormLabel>

        <Submit disabled={loading}>Submit</Submit>
      </Form>
    </>
  )
}

export default NewEventPage
