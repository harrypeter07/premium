import { NextRequest, NextResponse } from 'next/server';

// Next.js 16+ uses 'proxy' export (middleware is deprecated)
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin sub-routes
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
