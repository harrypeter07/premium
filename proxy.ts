import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin sub-routes — redirect to /admin login if no session cookie
  if (pathname.startsWith('/admin/')) {
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
