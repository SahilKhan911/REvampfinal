import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null;
let mockClientInstance: SupabaseClient | null = null;

export const supabase = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    if (!supabaseInstance) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = typeof window === 'undefined'
        ? (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
        : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        // Return a mock instance during build
        if (process.env.npm_lifecycle_event === 'build' || process.env.NEXT_PHASE) {
          if (!mockClientInstance) {
            mockClientInstance = createClient('https://placeholder.supabase.co', 'placeholder');
          }
          return (mockClientInstance as any)[prop];
        }

        throw new Error(`Missing Supabase environment variables! URL: ${!!supabaseUrl}, Key: ${!!supabaseKey}`)
      }

      supabaseInstance = createClient(supabaseUrl, supabaseKey)
    }

    return (supabaseInstance as any)[prop]
  }
})
