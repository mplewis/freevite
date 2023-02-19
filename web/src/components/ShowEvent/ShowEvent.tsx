export interface Props {
  event: {
    title: string
    description: string
    start: string
    end: string
  }
}

const ShowEvent = ({ event }: Props) => {
  const { title, description, start, end } = event
  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      <p>{start}</p>
      <p>{end}</p>
    </div>
  )
}

export default ShowEvent
