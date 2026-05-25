import { clerkClient } from '@clerk/nextjs/server'
import { withAuth } from '@/lib/api/auth-guard'
import { db, users } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { ok, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

// DELETE /api/auth/account  — permanently delete the caller's account
export const DELETE = withAuth(async (_req: NextRequest, { profile }) => {
  try {
    // Delete from DB first (cascades to all profile / donation data)
    await db.delete(users).where(eq(users.id, profile.id))

    // Then revoke Clerk account — if this fails the DB row is already gone,
    // which is acceptable (orphaned Clerk auth with no matching DB row is safe).
    if (profile.clerk_id) {
      const clerk = await clerkClient()
      await clerk.users.deleteUser(profile.clerk_id).catch((e) => {
        console.warn('[DELETE /api/auth/account] Clerk delete failed (DB already deleted):', e)
      })
    }

    return ok({ message: 'Account deleted successfully.' })
  } catch (e) {
    console.error('[DELETE /api/auth/account]', e)
    return serverError('Failed to delete account.')
  }
})
