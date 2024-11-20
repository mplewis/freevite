describe('sign', () => {
  const data = 'some-test-data'
  const secretKey = 'secret-key-for-testing'
  const expectedSignature = 'jpP2ltofCWsaXDeZZhTybDKA1mLzgnLxmkOO_iGqoZM'

  describe('with a secret key set', () => {
    beforeAll(() => {
      process.env.SECRET_KEY = secretKey
    })
    afterAll(() => {
      delete process.env.SECRET_KEY
    })

    it('signs data', () => {
      const { sign } = require('./sign')
      const signature = sign(data)
      expect(signature).toEqual(expectedSignature)
    })

    it('verifies signatures', () => {
      const { sign, verify } = require('./sign')
      expect(verify(data, expectedSignature)).toBe(true)
      expect(verify(data, sign(data))).toBe(true)
      expect(verify(data, 'invalid-signature')).toBe(false)
    })
  })
})
