import { unsubscribeFooter, unsubscribeLink } from './unsubscribe'

describe('with a secret key set', () => {
  const secretKey = 'secret-key-for-testing'
  beforeEach(() => {
    process.env.SECRET_KEY = secretKey
  })
  afterEach(() => {
    delete process.env.SECRET_KEY
  })

  describe('unsubscribeLink', () => {
    it('builds the signed unsubscribe link for an email address', () => {
      expect(unsubscribeLink('angela@ecorp.tk')).toEqual(
        `https://example.com/unsubscribe?` +
          `email=angela%40ecorp.tk&` +
          `token=aqoOgTFC8FtmzJXxn7os8kWCbJRzz4Mr5ToXfOvfXsY`
      )
    })
  })

  describe('unsubscribeFooter', () => {
    it('builds the footer with the signed unsubscribe link', () => {
      expect(unsubscribeFooter('angela@ecorp.tk')).toEqual(
        `To unsubscribe from all Freevite emails forever, click here:\n` +
          `https://example.com/unsubscribe?` +
          `email=angela%40ecorp.tk&` +
          `token=aqoOgTFC8FtmzJXxn7os8kWCbJRzz4Mr5ToXfOvfXsY`
      )
    })
  })
})
