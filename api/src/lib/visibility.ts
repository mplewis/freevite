interface Event {
  confirmed: boolean
  visible: boolean
}

export function checkVisibility(
  e: Event | null | undefined
): { visible: true } | { visible: false; reason: string } {
  if (!e) return { visible: false, reason: 'Event is not present' }
  if (!e.confirmed) return { visible: false, reason: 'Event is not confirmed' }
  if (!e.visible)
    return { visible: false, reason: 'Event is not set to visible' }
  return { visible: true }
}
