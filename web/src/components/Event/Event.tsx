import { faCalendarDay, faEllipsis } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Calendar, { Props as CalendarProps } from '../Calendar/Calendar'

type Props = {
  calendar: CalendarProps
  title: string
  description: string
}

const Event = (props: Props) => {
  const { calendar, title, description } = props
  return (
    <div className="flex" style={{ width: '600px' }}>
      <div className="flex-none">
        <Calendar {...calendar} />
      </div>

      <div className="my-2 flex flex-col justify-between">
        <div
          className="ml-4 grid grid-cols-1 grid-rows-4 gap-2 text-xl"
          style={{ gridTemplateColumns: '25px auto', gridTemplateRows: 'auto' }}
        >
          <FontAwesomeIcon className="pt-1" icon={faCalendarDay} />
          <p className="font-bold">{title}</p>
          <FontAwesomeIcon className="pt-1" icon={faEllipsis} />
          <p>{description}</p>
        </div>
        <div className="text-right">Powered by Freevite</div>
      </div>
    </div>
  )
}

export default Event
