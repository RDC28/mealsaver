import { createClient } from '@/lib/supabase/server'
import { unauthorized, forbidden, serverError } from './response'
import type { UserRole, User } from '@/lib/supabase/types'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'
import type { NextRequest } from 'next/server'

// ─────────────────────────────────────────────────────────────
// Auth context injected into every protected handler
// ─────────────────────────────────────────────────────────────
export type AuthContext = {
  user: {
    id: string
    email: string | undefined
  }
  profile: User                               // row from public.users
  supabase: SupabaseClient<Database>
}

// Next.js App Router route context (contains params for dynamic routes)
type RouteContext = {
  params?: Promise<Record<string, string>>
}

// The handler shape every protected route must match
type ProtectedHandler = (
  req: NextRequest,
  auth: AuthContext,
  routeCtx: RouteContext
) => Promise<Response>

// ─────────────────────────────────────────────────────────────
// withAuth — wraps a route handler with auth + optional role check
//
// Usage (any logged-in user):
//   export const GET = withAuth(async (req, { user, profile, supabase }) => { ... })
//
// Usage (specific roles only):
//   export const POST = withAuth(async (req, { profile, supabase }) => { ... }, ['admin'])
//
// Usage (dynamic route with params):
//   export const GET = withAuth(async (req, { supabase }, ctx) => {
//     const { id } = await ctx.params!
//   })
// ─────────────────────────────────────────────────────────────
export function withAuth(
  handler: ProtectedHandler,
  allowedRoles?: UserRole[]
) {
  return async (req: NextRequest, routeCtx: RouteContext = {}) => {
    try {
      const supabase = await createClient()

      // 1. Verify the session
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) return unauthorized()

      // 2. Load the public profile (contains our app role)
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError || !profile) {
        // Edge case: auth user exists but trigger didn't create profile yet
        return serverError('User profile not found. Please contact support.')
      }

      // 3. Check account is active
      if (!profile.is_active) {
        return forbidden('Your account has been suspended. Contact support.')
      }

      // 4. Role guard
      if (allowedRoles && !allowedRoles.includes(profile.role)) {
        return forbidden(`This action requires one of: ${allowedRoles.join(', ')}`)
      }

      // 5. Call the actual handler
      return handler(
        req,
        { user: { id: user.id, email: user.email }, profile, supabase },
        routeCtx
      )
    } catch (e) {
      console.error('[withAuth] Unexpected error:', e)
      return serverError()
    }
  }
}

// ─────────────────────────────────────────────────────────────
// Role-specific convenience wrappers
// ─────────────────────────────────────────────────────────────
export const withDonor    = (h: ProtectedHandler) => withAuth(h, ['donor'])
export const withReceiver = (h: ProtectedHandler) => withAuth(h, ['receiver'])
export const withAdmin    = (h: ProtectedHandler) => withAuth(h, ['admin'])
export const withDonorOrAdmin    = (h: ProtectedHandler) => withAuth(h, ['donor', 'admin'])
export const withReceiverOrAdmin = (h: ProtectedHandler) => withAuth(h, ['receiver', 'admin'])
