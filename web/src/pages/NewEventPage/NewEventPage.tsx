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
  Controller,
} from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { MetaTags, useMutation } from '@redwoodjs/web'

import FormField from 'src/components/FormField/FormField'
import { emailMatcher, isEmail } from 'src/logic/validations'
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
  const formMethods = useForm({
    defaultValues: { ownerEmail: '', title: '' },
  })
  const { control, formState, watch } = formMethods

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
        <Controller
          control={control}
          name="ownerEmail"
          render={({ field }) => (
            <FormField name="ownerEmail" text="Email Address">
              <EmailField
                name="ownerEmail"
                validation={{ ...isEmail }}
                onChange={field.onChange}
                value={field.value}
                {...fieldAttrs.input}
              />
            </FormField>
          )}
        />

        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <FormField name="title" text="Title">
              <TextField
                name="title"
                validation={{ required: true }}
                onChange={field.onChange}
                value={field.value}
                {...fieldAttrs.input}
              />
            </FormField>
          )}
        />

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
