export type Args = {
  action: () => void
  desc: string
  confirmWith: string
}

export const promptConfirm = ({ action, desc, confirmWith }: Args) => {
  const resp = prompt(
    `Warning! You are about to permanently ${desc}. ` +
      `This action cannot be undone.\n\nTo confirm, type ${confirmWith}:`
  )
  if (resp === null) return
  if (resp !== confirmWith) {
    alert(
      "Sorry, you didn't enter the correct confirmation text. Please try again."
    )
    return
  }
  action()
}
