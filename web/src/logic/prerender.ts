/**
 * Call a function that requires a browser, or noop in a prerender environment to avoid crashing
 * the prerender.
 * @param callable The function to call if we are in a browser environment
 * @returns The result of the callable function, or null if we are in a prerender environment
 */
export function prerenderSafe<T>(callable: () => T): T | null {
  if (typeof window === 'undefined') return null
  return callable()
}
