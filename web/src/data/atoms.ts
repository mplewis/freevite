import { atomWithStorage, createJSONStorage } from 'jotai/utils'

const storage = createJSONStorage<Record<string, string>>(() => localStorage)

export const responseTokenAtom = atomWithStorage<Record<string, string>>(
  `responseToken`,
  {},
  storage
)
