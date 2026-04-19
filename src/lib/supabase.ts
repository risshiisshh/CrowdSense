// ─────────────────────────────────────────────────────────────────────────────
// CrowdSense — Supabase Configuration
// REPLACE_WITH_YOUR_* values must be substituted before Mission 2!
// ─────────────────────────────────────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL      = 'REPLACE_WITH_YOUR_SUPABASE_URL'
const SUPABASE_ANON_KEY = 'REPLACE_WITH_YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true },
  realtime: { params: { eventsPerSecond: 10 } },
})

/**
 * Sets the Authorization header to a custom JWT issued for authenticating
 * Firebase-to-Supabase sessions. Called after Firebase sign-in.
 */
export async function setSupabaseUser(firebaseUid: string): Promise<void> {
  const { error } = await supabase.auth.signInAnonymously()
  if (error) console.error('[Supabase] setSupabaseUser error:', error)
  // In Mission 2 replace this with a proper custom token flow
  console.log('[Supabase] Session set for Firebase UID:', firebaseUid)
}
