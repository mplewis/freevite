function get(key: string): string {
  const val = process.env[key]
  if (!val) throw new Error(`Missing required environment variable: ${key}`)
  return val
}

/** The hostname of the deployed application, e.g. `example.com` */
export const SITE_HOST = get('SITE_HOST')
