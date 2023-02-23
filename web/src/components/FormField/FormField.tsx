import { FieldError } from '@redwoodjs/forms'

export type Props = {
  children: React.ReactNode
  name: string
  text: string
}

const FormField = ({ name, text, children }: Props) => {
  return (
    <div className="field">
      <label className="label" htmlFor={name}>
        {text}
        <div className="control">{children}</div>
        <FieldError name={name} className="error has-text-danger" />
      </label>
    </div>
  )
}

export default FormField
