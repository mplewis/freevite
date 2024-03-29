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
import { useMutation } from '@redwoodjs/web'

import FormField from 'src/components/FormField/FormField'
import PageHead from 'src/components/PageHead/PageHead'
import Typ from 'src/components/Typ/Typ'
import { isEmail } from 'src/logic/validation'
import { fieldAttrs, formErrorAttrs } from 'src/styles/classes'

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
  const formMethods = useForm({
    mode: 'onTouched',
    defaultValues: { ownerEmail: '', title: '' },
  })
  const { formState } = formMethods

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
      <PageHead
        title="Create New Event"
        desc="Create a new event on Freevite, the simple event platform. No signup required."
      />

      <Form
        className="mt-3"
        formMethods={formMethods}
        onSubmit={(input: FormValues) => create({ variables: { input } })}
      >
        <FormField name="ownerEmail" text="Email Address">
          <Typ x="labelDetails">
            No passwords needed. We&apos;ll email you a link to manage your
            event. Your email address stays private.
          </Typ>
          <EmailField
            name="ownerEmail"
            validation={{ ...isEmail }}
            disabled={loading}
            {...fieldAttrs.input}
          />
        </FormField>

        <FormField name="title" text="Title">
          <Typ x="labelDetails">You can change this at any time.</Typ>
          <TextField
            name="title"
            validation={{ required: true }}
            disabled={loading}
            {...fieldAttrs.input}
          />
        </FormField>

        <Submit
          className="button is-success mt-3"
          disabled={loading || redirecting || !formState.isValid}
        >
          {loading || redirecting ? 'Creating...' : 'Create New Event'}
        </Submit>
        <FormError error={error} {...formErrorAttrs} />
      </Form>
    </>
  )
}

export default NewEventPage
