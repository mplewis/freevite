export type Props = {
  onClick: () => void
  text: string
  disabled?: boolean
}

const DeleteButton = ({ disabled, onClick, text }: Props) => {
  return (
    <div className="mt-3">
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
