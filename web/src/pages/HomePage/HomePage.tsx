import { useState } from 'react'

import { Alarm } from 'ics'

import {
  FieldError,
  Form,
  InputField,
  Submit,
  TextAreaField,
  TextField,
} from '@redwoodjs/forms'
import { MetaTags } from '@redwoodjs/web'

import { alarmToString } from 'src/lib/format'
import { parseAlarms } from 'src/lib/parse'

const HomePage = () => {
  const [title, setTitle] = useState('')
  const [alarms, setAlarms] = useState([] as Alarm[])

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone.replace('_', ' ')

  return (
    <>
      <MetaTags title="Home" description="Home page" />

      <h1>Create New Event</h1>
      <Form onSubmit={console.log}>
        {/* fields: title, description, start date/time, end date/time, alarms */}
        <label className="block" htmlFor="title">
          Title
          <TextField
            name="title"
            className="block w-full"
            validation={{ required: true }}
            onChange={(ev) => setTitle(ev.target.value)}
            errorClassName="error block"
          />
          <FieldError name="title" className="error block" />
        </label>

        <label className="block" htmlFor="description">
          Description
          <TextAreaField
            name="description"
            className="block w-full"
            validation={{ required: true }}
            errorClassName="error block"
            rows={4}
          />
          <FieldError name="description" className="error block" />
        </label>

        <label className="block" htmlFor="start">
          Start
          <div className="block">
            <InputField
              type="datetime-local"
              name="start"
              validation={{ required: true }}
              errorClassName="error"
            />
            <span className="ml-3">Timezone: {tz}</span>
          </div>
          <FieldError name="start" className="error block" />
        </label>

        <label className="block" htmlFor="end">
          End
          <div className="block">
            <InputField
              type="datetime-local"
              name="end"
              validation={{ required: true }}
              errorClassName="error"
            />
            <span className="ml-3">Timezone: {tz}</span>
          </div>
          <FieldError name="end" className="error block" />
        </label>

        <label className="block" htmlFor="alarms">
          Alarms
          <TextField
            name="alarms"
            className="block"
            // validation={{ required: true }}
            onChange={(ev) => setAlarms(parseAlarms(ev.target.value, title))}
            errorClassName="error block"
          />
          <FieldError name="alarms" className="error block" />
          <pre>
            <code>{alarms.map((a) => alarmToString(a)).join(', ')}</code>
          </pre>
        </label>

        <Submit>Save</Submit>
      </Form>
    </>
  )
}

export default HomePage
