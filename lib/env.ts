const requiredEnvs = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
  'JWT_SECRET',
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_UPI_ID',
] as const

type Env = {
  [K in typeof requiredEnvs[number]]: string
}

function validateEnv(): Env {
  const env: Partial<Env> = {}
  const isServer = typeof window === 'undefined'

  for (const key of requiredEnvs) {
    const value = process.env[key]

    const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'

    if (isServer && !value && !isBuildPhase) {
      console.warn(`Missing environment variable: ${key}`)
    }

    env[key] = value || ''
  }

  return env as Env
}

export const env = validateEnv()
