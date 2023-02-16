import {
  UpdateEventMutation,
  UpdateEventMutationVariables,
} from 'types/graphql'

import {
  Form,
  FormError,
  InputField,
  Submit,
  TextAreaField,
  TextField,
} from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'

import { fieldAttrs } from 'src/classes'
import FormLabel from 'src/components/FormLabel/FormLabel'

export type Props = {
  editToken: string
  data: FormValues
}

interface FormValues {
  editToken: string
  expiresAt: string
  visible: boolean
  slug: string
  title: string
  description: string
  start: string
  end: string
  reminders: string
}

const UPDATE_EVENT = gql`
  mutation UpdateEventMutation($editToken: String!, $input: UpdateEventInput!) {
    updateEvent(editToken: $editToken, input: $input) {
      expiresAt
      visible
      slug
      title
      description
      start
      end
      reminders
    }
  }
`

const EditEventForm = () => {
  const [save, { loading, error }] = useMutation<
    UpdateEventMutation,
    UpdateEventMutationVariables
  >(UPDATE_EVENT, {
    onCompleted: () => {
      console.log('Saved') // TODO: toast?
    },
  })

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone.replace('_', ' ')
  // const [alarms, setAlarms] = useState([] as Alarm[])
  // const alarmMsgs = alarms.map((a) => alarmToString(a))

  return (
    <Form
      onSubmit={(input: FormValues) =>
        save({ variables: { editToken, input } })
      }
    >
      <FormError error={error} wrapperClassName="form-error" />

      <FormLabel name="title" text="Title">
        <TextField
          name="title"
          validation={{ required: true }}
          {...fieldAttrs}
        />
      </FormLabel>

      <FormLabel name="description" text="Description">
        <TextAreaField
          name="description"
          validation={{ required: true }}
          rows={4}
          {...fieldAttrs}
        />
      </FormLabel>

      <FormLabel name="start" text="Start">
        <InputField
          type="datetime-local"
          name="start"
          validation={{ required: true }}
          {...fieldAttrs}
        />
        <span className="ml-3">Timezone: {tz}</span>
      </FormLabel>

      <FormLabel name="end" text="End">
        <InputField
          type="datetime-local"
          name="end"
          validation={{ required: true }}
          {...fieldAttrs}
        />
        <span className="ml-3">Timezone: {tz}</span>
      </FormLabel>

      {/* <FormLabel name="reminders" text="Reminders">
          <TextField name="reminders" {...fieldAttrs} />
          <ul>
            {alarmMsgs.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </FormLabel> */}

      <Submit disabled={loading}>Save</Submit>
    </Form>
  )
}

export default EditEventForm
