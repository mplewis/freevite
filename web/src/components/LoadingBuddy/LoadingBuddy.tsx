import { useEffect, useState } from 'react'

export type Props = {
  className?: string
}

const apologies = [
  'Just a sec',
  'One moment',
  'Hang on',
  'Hold tight',
  'Almost there',
  'Just a moment',
]

const loadingMessages = [
  'reticulating splines',
  'refilling the bowl of chips',
  'going on a Costco run',
  'spiking the punch',
  'reversing the polarity',
  'looking for the car keys',
  'feeding the cat',
  'achieving inbox zero',
  'finishing that novel',
  'looking for the cat',
  'petting dogs',
  'reading the fine print',
  'planning a heist',
  'getting the band back together',
]

function random<T>(choices: T[]): T {
  return choices[Math.floor(Math.random() * choices.length)]
}

const LoadingBuddy = ({ className }: Props) => {
  const [message, setMessage] = useState('')
  useEffect(() => {
    const msg = `${random(apologies)}, ${random(loadingMessages)}...`
    setMessage(msg)
  }, [])
  return <span className={className}>{message}</span>
}

export default LoadingBuddy
