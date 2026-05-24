import { withAuth } from '@/lib/api/auth-guard'
import { db, donor_profiles, receiver_profiles } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { ok } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

// ─────────────────────────────────────────────────────────────
// GET /api/auth/me
// Returns the current user's profile + profile completion status.
// Protected — requires a valid Clerk session.
// ─────────────────────────────────────────────────────────────

export const GET = withAuth(async (_req: NextRequest, { profile }) => {
  let profileComplete = false
  let profileId: string | null = null

  if (profile.role === 'donor') {
    const [donorProfile] = await db
      .select({ id: donor_profiles.id, verification_status: donor_profiles.verification_status })
      .from(donor_profiles)
      .where(eq(donor_profiles.user_id, profile.id))

    profileComplete = !!donorProfile
    profileId = donorProfile?.id ?? null
  } else if (profile.role === 'receiver') {
    const [receiverProfile] = await db
      .select({ id: receiver_profiles.id, verification_status: receiver_profiles.verification_status })
      .from(receiver_profiles)
      .where(eq(receiver_profiles.user_id, profile.id))

    profileComplete = !!receiverProfile
    profileId = receiverProfile?.id ?? null
  } else {
    profileComplete = true
  }

  return ok({
    id:               profile.id,
    email:            profile.email,
    full_name:        profile.full_name,
    phone:            profile.phone,
    avatar_url:       profile.avatar_url,
    role:             profile.role,
    is_active:        profile.is_active,
    profile_complete: profileComplete,
    profile_id:       profileId,
    created_at:       profile.created_at,
  })
})
