import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  CheckboxField,
  DatetimeLocalField,
  Submit,
} from '@redwoodjs/forms'

import type { EditEventById, UpdateEventInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'



const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, '')
  }
}


type FormEvent = NonNullable<EditEventById['event']>

interface EventFormProps {
  event?: EditEventById['event']
  onSave: (data: UpdateEventInput, id?: FormEvent['id']) => void
  error: RWGqlError
  loading: boolean
}

const EventForm = (props: EventFormProps) => {
  const onSubmit = (data: FormEvent) => {
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    
    
  
    props.onSave(data, props?.event?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormEvent> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />
      
        <Label
          name="token"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Token
        </Label>
        
          <TextField
            name="token"
            defaultValue={props.event?.token}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />
        

        <FieldError name="token" className="rw-field-error" />

        <Label
          name="confirmed"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Confirmed
        </Label>
        
          <CheckboxField
            name="confirmed"
            defaultChecked={props.event?.confirmed}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
        

        <FieldError name="confirmed" className="rw-field-error" />

        <Label
          name="expiresAt"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Expires at
        </Label>
        
          <DatetimeLocalField
            name="expiresAt"
            defaultValue={formatDatetime(props.event?.expiresAt)}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />
        

        <FieldError name="expiresAt" className="rw-field-error" />

        <Label
          name="visible"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Visible
        </Label>
        
          <CheckboxField
            name="visible"
            defaultChecked={props.event?.visible}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          />
        

        <FieldError name="visible" className="rw-field-error" />

        <Label
          name="title"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Title
        </Label>
        
          <TextField
            name="title"
            defaultValue={props.event?.title}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />
        

        <FieldError name="title" className="rw-field-error" />

        <Label
          name="description"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Description
        </Label>
        
          <TextField
            name="description"
            defaultValue={props.event?.description}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />
        

        <FieldError name="description" className="rw-field-error" />

        <Label
          name="start"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Start
        </Label>
        
          <DatetimeLocalField
            name="start"
            defaultValue={formatDatetime(props.event?.start)}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />
        

        <FieldError name="start" className="rw-field-error" />

        <Label
          name="end"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          End
        </Label>
        
          <DatetimeLocalField
            name="end"
            defaultValue={formatDatetime(props.event?.end)}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />
        

        <FieldError name="end" className="rw-field-error" />

        <Label
          name="reminders"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Reminders
        </Label>
        
          <TextField
            name="reminders"
            defaultValue={props.event?.reminders}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />
        

        <FieldError name="reminders" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit
            disabled={props.loading}
            className="rw-button rw-button-blue"
          >
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default EventForm
