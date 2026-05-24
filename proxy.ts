import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// ── Public routes — never require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/register',
  '/donor/register',
  '/ngo/register',
  '/api/auth/signup',
])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimisation)
     * - favicon.ico and static assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
