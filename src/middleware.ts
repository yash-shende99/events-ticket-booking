import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "fallback_secret_key");

// Define routes and required roles
const protectedRoutes = {
  '/profile': ['Customer', 'Organiser', 'Admin'],
  '/admin': ['Admin'],
  '/organiser': ['Organiser', 'Admin']
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Find if current path matches any protected route prefix
  const protectedRoute = Object.entries(protectedRoutes).find(([route]) => path.startsWith(route));
  
  if (protectedRoute) {
    const [route, allowedRoles] = protectedRoute;
    
    // Check for access token cookie
    const token = request.cookies.get('access_token')?.value;
    
    if (!token) {
      // Not authenticated
      return NextResponse.redirect(new URL('/login?error=Authentication+required', request.url));
    }
    
    try {
      // Verify JWT using jose (since standard jsonwebtoken library uses Node APIs not available in edge runtime)
      const { payload } = await jwtVerify(token, JWT_SECRET);
      
      const userRole = payload.role as string;
      
      if (!allowedRoles.includes(userRole)) {
        // Authenticated but unauthorized role
        return NextResponse.redirect(new URL('/?error=Unauthorized+access', request.url));
      }
      
      return NextResponse.next();
    } catch (error) {
      // Token is invalid or expired
      return NextResponse.redirect(new URL('/login?error=Session+expired', request.url));
    }
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    '/profile/:path*',
    '/admin/:path*',
    '/organiser/:path*'
  ]
}
