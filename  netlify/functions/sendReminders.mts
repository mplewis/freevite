import type { Config } from '@netlify/functions'

export default async (req: Request) => {
  const { next_run: nextRun } = await req.json()
  console.log('Received event! Next invocation at:', nextRun)
}

export const config: Config = { schedule: '* * * * *' }
