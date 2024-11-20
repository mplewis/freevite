describe('sign', () => {
  const data = 'some-test-data'
  const expectedSignature = 'jpP2ltofCWsaXDeZZhTybDKA1mLzgnLxmkOO_iGqoZM'

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
