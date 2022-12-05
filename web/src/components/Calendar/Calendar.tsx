type Props = {
  month: string
  day: string
  time: string
}

const Calendar = (props: Props) => {
  const { month, day, time } = props
  return (
    <div
      className="inline-block rounded-lg text-center drop-shadow-lg"
      style={{
        width: '200px',
        height: '200px',
        backgroundColor: 'white',
      }}
    >
      <div
        className="month block rounded-t-lg py-1 font-semibold"
        style={{
          backgroundColor: '#F65D55',
          color: 'white',
          fontSize: '30px',
        }}
      >
        {month}
      </div>
      <div
        className="day pt-3 pb-1"
        style={{ fontSize: '80px', lineHeight: '1' }}
      >
        {day}
      </div>
      <div className="time" style={{ fontSize: '24px', color: '#838383' }}>
        {time}
      </div>
    </div>
  )
}

export default Calendar
