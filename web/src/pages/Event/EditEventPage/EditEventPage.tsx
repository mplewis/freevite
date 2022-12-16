import EditEventCell from 'src/components/Event/EditEventCell'

type EventPageProps = {
  id: number
}

const EditEventPage = ({ id }: EventPageProps) => {
  return <EditEventCell id={id} />
}

export default EditEventPage
