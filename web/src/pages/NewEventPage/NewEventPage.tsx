import {
  CreateEventMutation,
  CreateEventMutationVariables,
} from 'types/graphql'

import { Form, TextField, EmailField, FormError } from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { MetaTags, useMutation } from '@redwoodjs/web'

import FormLabel from 'src/components/FormLabel/FormLabel'

const fieldAttrs = {
  className: 'block w-full',
  errorClassName: 'error block',
}

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
            // validation={{ required: true }}
            {...fieldAttrs}
          />
        </FormLabel>

        <button type="submit" disabled={loading}>
          Submit
        </button>
      </Form>
    </>
  )
}

export default NewEventPage
