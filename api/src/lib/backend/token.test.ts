import { alphaLower, generateToken } from './token'

describe('generateToken', () => {
  it('works as expected', () => {
    expect(generateToken()).toHaveLength(32)
    expect(generateToken({ count: 10 })).toHaveLength(10)
    expect(generateToken({ prefix: 'foo_', count: 8, charset: alphaLower })).toMatch(/^foo_[a-z]{8}$/)
  })
})
