import { FieldError } from '@redwoodjs/forms'

export type Props = {
  children: React.ReactNode
  name: string
  text: string
}

const FormLabel = ({ name, text, children }: Props) => {
  return (
    <label className="block" htmlFor={name}>
      {text}
      {children}
      <FieldError name={name} className="error block" />
    </label>
  )
}

export default FormLabel
