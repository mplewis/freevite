export type Props = {
  className?: string
  onClick: () => void
  text: string
  disabled?: boolean
  deleting?: boolean
  deletingText?: string
}

const DeleteButton = ({
  className,
  onClick,
  text,
  disabled,
  deleting,
  deletingText,
}: Props) => {
  const isDisabled = disabled || deleting

  return (
    <div className={className}>
      <button
        className="button is-danger"
        disabled={isDisabled}
        onClick={(ev) => {
          ev.preventDefault()
          onClick()
        }}
      >
        {deleting ? deletingText || 'Deleting...' : text}
      </button>
    </div>
  )
}

export default DeleteButton
