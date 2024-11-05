/** Scroll to the named anchor if it exists. */
export function scrollTo(anchor: string) {
  document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' })
}
