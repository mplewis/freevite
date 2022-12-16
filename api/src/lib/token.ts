const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export function generateToken(): string {
  const count = 32
  const result = []
  for (let i = 0; i < count; i++) {
    result.push(chars[Math.floor(Math.random() * chars.length)])
  }
  return result.join('')
}
