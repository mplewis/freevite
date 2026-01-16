export type Args<T> = {
  action: () => Promise<T>
  desc: string
  confirmWith: string
}

/**
 * Prompt the user to confirm an action by typing a specific string.
 * @param action The action to perform if the user confirms
 * @param desc A description of the action to be confirmed
 * @param confirmWith The string the user must type to confirm the action
 * @returns The result of the action if the user confirms,
 *          or `null` if they cancel the operation or enter the wrong confirmation text
 */
export async function promptConfirm<T>({ action, desc, confirmWith }: Args<T>): Promise<T | null> {
  const resp = prompt(
    `Warning! You are about to permanently ${desc}. ` +
      `This action cannot be undone.\n\nTo confirm, type ${confirmWith}:`
  )

  if (resp === null) return null
  if (resp !== confirmWith) {
    alert("Sorry, you didn't enter the correct confirmation text. Please try again.")
    return null
  }

  return action()
}
