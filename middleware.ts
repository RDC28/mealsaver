import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Supabase middleware — refreshes the user's session on every request.
 * Required for server-side auth to work correctly in Next.js App Router.
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh the session — this keeps auth tokens alive
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // ── Public routes — never require auth (explicit allowlist)
  const publicPaths = [
    '/',
    '/login',
    '/register',
    '/donor/register',   // registration forms are public
    '/ngo/register',
  ]

  const isPublicPath = publicPaths.includes(pathname)

  // ── Protected route prefixes — require auth
  // List specific sub-paths, not top-level folders, so /donor/register stays public
  const protectedPrefixes = [
    '/donor/dashboard',
    '/donor/donations',
    '/ngo/dashboard',
    '/ngo/donations',
    '/ngo/pickups',
    '/admin',
    '/pickup',
    '/delivery',
    '/impact',
    '/profile',
  ]

  const isProtectedPath =
    !isPublicPath &&
    protectedPrefixes.some(prefix => pathname.startsWith(prefix))

  if (isProtectedPath && !user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // ── Redirect already logged-in users away from auth/register pages
  if (user && (pathname === '/login' || pathname === '/register')) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/'
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico and public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
