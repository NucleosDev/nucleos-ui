import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ROUTES } from '@/constants/routes'

const publicRoutes = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
]

const authRoutes = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith('/_next') || pathname.startsWith('/api')
  )

  // Check if it's an auth route (login/register)
  const isAuthRoute = authRoutes.some((route) => pathname === route)

  // For now, we'll just pass through since auth is handled client-side
  // In a production app with server-side auth, you would check cookies here

  // If accessing auth routes while potentially authenticated,
  // the client-side will handle the redirect

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
}
