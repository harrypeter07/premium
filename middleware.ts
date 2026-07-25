import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin routes except the main login page itself
  if (pathname.startsWith('/admin') && pathname !== '/admin') {
    // Check for admin session cookie (set server-side) OR allow with localStorage check done client-side
    // Since localStorage is client-only, we use a cookie instead for proper server-side protection
    const adminSession = req.cookies.get('smr_admin_session');
    if (!adminSession || adminSession.value !== 'authorized') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path+'],
};
