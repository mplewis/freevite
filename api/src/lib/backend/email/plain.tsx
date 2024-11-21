import React from 'react'

/** Dummy renderer to render plain text as a React element. */
export function Plain({ text }: { text: string }) {
  return <>{text}</>
}
