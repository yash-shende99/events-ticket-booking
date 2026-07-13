import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    const isProtectedRoute = 
      path.startsWith('/profile') || 
      path.startsWith('/admin') || 
      (path.startsWith('/organiser') && path !== '/organiser/register')

    // 1. Block unauthenticated access to protected routes
    if (!token && isProtectedRoute) {
      return NextResponse.redirect(new URL('/login?error=Authentication+required', req.url))
    }

    if (token) {
      const userRole = token.role as string;
      const isOrganiser = ['Organiser', 'organiser'].includes(userRole);
      const isAdmin = ['Admin', 'admin'].includes(userRole);

      // Prevent Admins from visiting customer pages
      if (isAdmin) {
        if (!path.startsWith('/admin') && path !== '/login' && path !== '/register') {
          return NextResponse.redirect(new URL('/admin', req.url))
        }
      } 
      // Prevent Organisers from visiting customer pages
      else if (isOrganiser) {
        if (!path.startsWith('/organiser') && path !== '/login' && path !== '/register') {
          return NextResponse.redirect(new URL('/organiser', req.url))
        }
      } 
      // 3. Prevent Customers from visiting organiser pages
      else {
        if (path.startsWith('/organiser') || path.startsWith('/admin')) {
          return NextResponse.redirect(new URL('/?error=Unauthorized', req.url))
        }
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      // Always return true so the middleware function always fires, even without a token
      authorized: () => true 
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
}
