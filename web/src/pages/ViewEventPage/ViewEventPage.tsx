import ViewEventCell from 'src/components/ViewEventCell'

interface Props {
  slug: string
}

const ViewEventPage = ({ slug }: Props) => {
  return <ViewEventCell slug={slug} />
}

export default ViewEventPage
