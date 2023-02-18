import { useState } from 'react'

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
  useForm,
} from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { MetaTags, useMutation } from '@redwoodjs/web'

import FormField from 'src/components/FormField/FormField'
import { isEmail } from 'src/logic/validations'
import { fieldAttrs } from 'src/style/classes'

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
  const formMethods = useForm({ defaultValues: { ownerEmail: '', title: '' } })
  const { formState, watch } = formMethods

  watch((values) => {
    console.log(values)
    console.log(formState.isValid)
  })

  const [redirecting, setRedirecting] = useState(false)

  const [create, { loading, error }] = useMutation<
    CreateEventMutation,
    CreateEventMutationVariables
  >(CREATE_EVENT, {
    onCompleted: (data) => {
      const { ownerEmail, title } = data.createEvent
      setRedirecting(true)
      navigate(routes.eventCreated({ email: ownerEmail, title }))
    },
  })

  return (
    <>
      <MetaTags title="NewEvent" description="NewEvent page" />

      <h1>NewEventPage</h1>

      <Form
        formMethods={formMethods}
        onSubmit={(input: FormValues) => create({ variables: { input } })}
      >
        <FormField name="ownerEmail" text="Email Address">
          <EmailField
            name="ownerEmail"
            validation={{ ...isEmail }}
            {...fieldAttrs.input}
          />
        </FormField>

        <FormField name="title" text="Title">
          <TextField
            name="title"
            validation={{ required: true }}
            {...fieldAttrs.input}
          />
        </FormField>

        <Submit
          className="button is-primary"
          disabled={loading || redirecting || !formState.isValid}
        >
          {loading || redirecting ? 'Creating...' : 'Create New Event'}
        </Submit>

        <FormError error={error} wrapperClassName="form-error" />
      </Form>
    </>
  )
}

export default NewEventPage
