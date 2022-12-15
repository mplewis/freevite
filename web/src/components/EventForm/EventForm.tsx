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

import { alarmToString } from 'src/lib/format'
import { parseAlarms } from 'src/lib/parse'

const EventForm = () => {
  const [title, setTitle] = useState('')
  const [alarms, setAlarms] = useState([] as Alarm[])

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone.replace('_', ' ')

  const alarmMsgs = alarms.map((a) => alarmToString(a))

  return (
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
        Reminders
        <TextField
          name="alarms"
          className="block"
          // validation={{ required: true }}
          onChange={(ev) => setAlarms(parseAlarms(ev.target.value, title))}
          errorClassName="error block"
        />
        <FieldError name="alarms" className="error block" />
        <ul>
          {alarmMsgs.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
        <details style={{ cursor: 'pointer' }}>
          <summary>How do I set reminders?</summary>
          <p>
            You can set one or more reminders to trigger with your event by
            listing them here, separated by commas.
          </p>
          <p>
            You can use the date units <strong>w</strong> for weeks,{' '}
            <strong>d</strong> for days, <strong>h</strong> for hours,{' '}
            <strong>m</strong> for minutes, and <strong>s</strong> for seconds.
            This syntax is flexible and supports spelling out the full unit
            names.
          </p>
          <p>
            For example:
            <ul>
              <li>
                <code>1w,1d</code> will set reminders for 1 week before and 1
                day before
              </li>
              <li>
                <code>2 hours, 15 minutes</code> will set reminders for 2 hours
                before and 15 minutes before.
              </li>
            </ul>
          </p>
        </details>
      </label>

      <Submit>Save</Submit>
    </Form>
  )
}

export default EventForm
