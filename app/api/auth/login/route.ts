import { createClient } from '@/lib/supabase/server'
import { validateBody, z } from '@/lib/api/validate'
import { ok, err, forbidden, serverError } from '@/lib/api/response'

// ─────────────────────────────────────────────────────────────
// POST /api/auth/login
// Signs the user in and returns their profile + session tokens.
// ─────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Must be a valid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
})

export async function POST(req: Request) {
  // 1. Validate request body
  const { data, error } = await validateBody(req, loginSchema)
  if (error) return error

  const supabase = await createClient()

  // 2. Sign in with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (authError) {
    // Don't reveal whether the email exists — always return generic message
    return err('Invalid email or password', 401, 'INVALID_CREDENTIALS')
  }

  if (!authData.user || !authData.session) return serverError()

  // 3. Load the user's app profile (role, name, status)
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('id, email, full_name, phone, avatar_url, role, is_active, created_at')
    .eq('id', authData.user.id)
    .single()

  if (profileError || !profile) {
    return serverError('Profile not found. Please contact support.')
  }

  // 4. Block suspended accounts
  if (!profile.is_active) {
    await supabase.auth.signOut()
    return forbidden('Your account has been suspended. Please contact support.')
  }

  // 5. Check if they have completed their profile setup
  let profileComplete = false
  if (profile.role === 'donor') {
    const { data: dp } = await supabase
      .from('donor_profiles')
      .select('id')
      .eq('user_id', profile.id)
      .maybeSingle()
    profileComplete = !!dp
  } else if (profile.role === 'receiver') {
    const { data: rp } = await supabase
      .from('receiver_profiles')
      .select('id')
      .eq('user_id', profile.id)
      .maybeSingle()
    profileComplete = !!rp
  } else {
    // Admins/delivery partners don't need a separate profile
    profileComplete = true
  }

  return ok({
    user: {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      phone: profile.phone,
      avatar_url: profile.avatar_url,
      role: profile.role,
      profile_complete: profileComplete,
      created_at: profile.created_at,
    },
    session: {
      access_token: authData.session.access_token,
      refresh_token: authData.session.refresh_token,
      expires_at: authData.session.expires_at,
    },
  })
}
