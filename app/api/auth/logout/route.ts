import { createClient } from '@/lib/supabase/server'
import { ok, serverError } from '@/lib/api/response'

// ─────────────────────────────────────────────────────────────
// POST /api/auth/logout
// Invalidates the session — works even if already logged out.
// ─────────────────────────────────────────────────────────────

export async function POST() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) return serverError(error.message)

  return ok({ message: 'Logged out successfully' })
}
