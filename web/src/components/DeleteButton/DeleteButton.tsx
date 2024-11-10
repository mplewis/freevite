export type Props = {
  className?: string
  onClick: () => void
  text: string
  disabled?: boolean
  disabledText?: string
}

const DeleteButton = ({
  className,
  onClick,
  text,
  disabled,
  disabledText,
}: Props) => {
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
        {disabled ? disabledText || 'Deleting...' : text}
      </button>
    </div>
  )
}

export default DeleteButton
