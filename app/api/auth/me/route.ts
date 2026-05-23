import { withAuth } from '@/lib/api/auth-guard'
import { ok } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

// ─────────────────────────────────────────────────────────────
// GET /api/auth/me
// Returns the current user's profile + profile completion status.
// Protected — requires a valid session.
// ─────────────────────────────────────────────────────────────

export const GET = withAuth(async (_req: NextRequest, { profile, supabase }) => {
  // Check profile completion
  let profileComplete = false
  let profileId: string | null = null

  if (profile.role === 'donor') {
    const { data } = await supabase
      .from('donor_profiles')
      .select('id, verification_status')
      .eq('user_id', profile.id)
      .maybeSingle()
    profileComplete = !!data
    profileId = data?.id ?? null
  } else if (profile.role === 'receiver') {
    const { data } = await supabase
      .from('receiver_profiles')
      .select('id, verification_status')
      .eq('user_id', profile.id)
      .maybeSingle()
    profileComplete = !!data
    profileId = data?.id ?? null
  } else {
    profileComplete = true
  }

  return ok({
    id: profile.id,
    email: profile.email,
    full_name: profile.full_name,
    phone: profile.phone,
    avatar_url: profile.avatar_url,
    role: profile.role,
    is_active: profile.is_active,
    profile_complete: profileComplete,
    profile_id: profileId,
    created_at: profile.created_at,
  })
})
