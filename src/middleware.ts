import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    if (!token) {
      return NextResponse.redirect(new URL('/login?error=Authentication+required', req.url))
    }

    const userRole = token.role as string

    if (path.startsWith('/admin') && userRole !== 'Admin') {
      return NextResponse.redirect(new URL('/?error=Unauthorized', req.url))
    }

    if (path.startsWith('/organiser') && !['Organiser', 'Admin'].includes(userRole)) {
      return NextResponse.redirect(new URL('/?error=Unauthorized', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    '/profile/:path*',
    '/admin/:path*',
    '/organiser/:path*'
  ]
}
