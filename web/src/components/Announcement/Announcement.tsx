export type Props = {
  msg: string
}

const Announcement = ({ msg }: Props) => {
  return <div className='notification is-info'>{msg}</div>
}

export default Announcement
