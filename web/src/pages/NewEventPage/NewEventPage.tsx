import {
  EmailField,
  Form,
  FormError,
  SelectField,
  Submit,
  TextField,
  useForm,
} from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { RECAPTCHA_CLIENT_KEY } from 'src/apiLibShared/shared.config'
import FormField from 'src/components/FormField/FormField'
import PageHead from 'src/components/PageHead/PageHead'
import Typ from 'src/components/Typ/Typ'
import { isEmail } from 'src/logic/validation'
import { fieldAttrs, formErrorAttrs } from 'src/styles/classes'
import type {
  CreateEventMutation,
  CreateEventMutationVariables,
  ResponseConfig,
} from 'types/graphql'

interface FormValues {
  ownerEmail: string
  title: string
  responseConfig: ResponseConfig
}

const CREATE_EVENT = gql`
  mutation CreateEventMutation($input: CreateEventInput!) {
    createEvent(input: $input) {
      ownerEmail
      title
      responseConfig
    }
  }
`

const responseConfigOptions: { config: ResponseConfig; label: string }[] = [
  {
    config: 'SHOW_ALL',
    label: 'Accept responses and display them to other attendees (name, head count, comments)',
  },
  {
    config: 'SHOW_COUNTS_ONLY',
    label:
      'Accept responses and display only head counts to other attendees (hide name and comments)',
  },
  {
    config: 'SHOW_NONE',
    label: 'Accept responses and hide details from other attendees (only you can see them)',
  },
  { config: 'DISABLED', label: 'Do not accept responses' },
]

const NewEventPage = () => {
  const formMethods = useForm({
    mode: 'onTouched',
    defaultValues: { ownerEmail: '', title: '' },
  })
  const { formState } = formMethods

  const [redirecting, setRedirecting] = useState(false)
  const [captchaResponse, setCaptchaResponse] = useState<string | null>(null)

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
        title='Create an Event'
        desc='Create a new event on Freevite, the simple event platform. No signup required.'
      />

      <Form
        className='mt-3'
        formMethods={formMethods}
        onSubmit={(input: FormValues) =>
          create({
            variables: { input: { ...input, captchaResponse } },
          })
        }
      >
        <FormField name='ownerEmail' text='Email Address*'>
          <Typ x='labelDetails'>
            No passwords needed. We&apos;ll email you a link to manage your event. Your email
            address stays private.
          </Typ>
          <EmailField
            name='ownerEmail'
            placeholder='yourname@example.com'
            validation={{ ...isEmail }}
            disabled={loading}
            {...fieldAttrs.input}
          />
        </FormField>

        <FormField name='title' text='Title*'>
          <Typ x='labelDetails'>You can change this at any time.</Typ>
          <TextField
            name='title'
            placeholder='My Awesome Party'
            validation={{ required: true }}
            disabled={loading}
            {...fieldAttrs.input}
          />
        </FormField>

        <FormField name='responseConfig' text='Accept responses?*'>
          <Typ x='labelDetails'>
            Freevite can send you an email when guests RSVP to your event. This can&apos;t be
            changed later.
          </Typ>
          <SelectField
            name='responseConfig'
            validation={{ required: true }}
            disabled={loading}
            {...fieldAttrs.input}
          >
            {responseConfigOptions.map(({ config, label }) => (
              <option key={config} value={config}>
                {label}
              </option>
            ))}
          </SelectField>
        </FormField>

        <ReCAPTCHA sitekey={RECAPTCHA_CLIENT_KEY} onChange={setCaptchaResponse} />

        <Submit
          className='button is-success mt-3'
          disabled={loading || redirecting || !formState.isValid || !captchaResponse}
        >
          {loading || redirecting ? 'Creating...' : 'Create New Event'}
        </Submit>
        <FormError error={error} {...formErrorAttrs} />
      </Form>
    </>
  )
}

export default NewEventPage
