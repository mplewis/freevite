import { useEffect, useState } from 'react'

import { ThreeDotsFade } from 'react-svg-spinners'

export type Props = {
  className?: string
  durationMs?: number
  transitionMs?: number
}

const apologies = [
  'Just a sec',
  'One moment',
  'Hang on',
  'Hold on',
  'Please wait',
  'Hold tight',
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

function random<T>(choices: T[], notLast?: T): T {
  let choice: T
  do {
    choice = choices[Math.floor(Math.random() * choices.length)]
  } while (choice === notLast)
  return choice
}

const LoadingBuddy = ({ className, durationMs, transitionMs }: Props) => {
  const dMs = durationMs || 4000
  const tMs = transitionMs || 500
  const [preamble, setPreamble] = useState('')
  const [message, setMessage] = useState('')
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    setPreamble(random(apologies))
    setMessage(random(loadingMessages))
  }, [])

  useEffect(() => {
    let timeout: NodeJS.Timeout
    const interval = setInterval(() => {
      setOpacity(0)
      timeout = setTimeout(() => {
        setMessage(random(loadingMessages, message))
        setOpacity(1)
      }, tMs)
    }, dMs)

    return () => {
      clearInterval(interval)
      if (timeout) clearTimeout(timeout)
    }
  }, [dMs, tMs, message])

  const msgTag = (
    <span style={{ transition: `opacity ease-in ${tMs / 1000}s`, opacity }}>
      {message}...
    </span>
  )

  return (
    <div className={`is-flex ${className}`}>
      <span className="mr-2">
        <ThreeDotsFade />
      </span>
      {preamble},&nbsp;{msgTag}
    </div>
  )
}

export default LoadingBuddy
