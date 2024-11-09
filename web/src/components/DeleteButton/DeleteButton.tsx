export type Props = {
  className?: string
  onClick: () => void
  text: string
  disabled?: boolean
}

const DeleteButton = ({ className, disabled, onClick, text }: Props) => {
  return (
    <div className={className}>
      <button
        className="button is-danger"
        disabled={disabled}
        onClick={(ev) => {
          ev.preventDefault()
          onClick()
        }}
      >
        {text}
      </button>
    </div>
  )
}

export default DeleteButton
