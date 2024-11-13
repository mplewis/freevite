import { useEffect, useState } from 'react'

import { ThreeDotsFade } from 'react-svg-spinners'

export type Props = {
  className?: string
  durationMs?: number
  transitionMs?: number
  spinnerPeriodMs?: number
}

export const defaultProps = {
  durationMs: 4000,
  transitionMs: 500,
  spinnerPeriodMs: 800,
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

const LoadingBuddy = ({
  className,
  durationMs,
  transitionMs,
  spinnerPeriodMs,
}: Props) => {
  // HACK: Match Bulma colors
  const light = 'rgb(219, 219, 219)'
  const dark = 'rgb(74, 74, 74)'
  const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches

  const dMs = durationMs || defaultProps.durationMs
  const tMs = transitionMs || defaultProps.transitionMs
  const sSec = (spinnerPeriodMs || defaultProps.spinnerPeriodMs) / 1000
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
        <ThreeDotsFade color={darkMode ? light : dark} dur={sSec} />
      </span>
      {preamble},&nbsp;{msgTag}
    </div>
  )
}

export default LoadingBuddy
