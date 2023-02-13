export const alphanumeric =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
export const alphaLower = 'abcdefghijklmnopqrstuvwxyz'

export type Params = {
  count: number
  charset: string
  prefix: string
}

const defaultParams: Params = {
  count: 32,
  charset: alphanumeric,
  prefix: '',
}

export function generateToken(params?: Partial<Params>): string {
  const { count, charset, prefix } = { ...defaultParams, ...params }
  const result = []
  for (let i = 0; i < count; i++) {
    result.push(charset[Math.floor(Math.random() * charset.length)])
  }
  return `${prefix}${result.join('')}`
}
