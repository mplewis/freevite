const emailMatcher = /^.+@.+\..+$/

export const isEmail = {
  validate: {
    isEmail: (email) => {
      if (!email) return 'email address is required'
      if (!emailMatcher.test(email)) return 'please double-check your email address'
    },
  },
}
