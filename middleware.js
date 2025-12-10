// middleware.js
import { NextResponse } from 'next/server'

export function middleware(request) {
  // Only protect /open route
  if (request.nextUrl.pathname.startsWith('/open')) {
    // Check if user is authenticated via cookie
    const authCookie = request.cookies.get('auth-token')
    
    if (!authCookie || authCookie.value !== 'authenticated') {
      // Redirect to login page
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/open/:path*',
}