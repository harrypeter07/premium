import { NextResponse } from 'next/server';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@smriti.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'smritishah123';
const ADMIN_NAME = 'Smriti Shah Admin';
const ADMIN_ROLE = 'ADMIN';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      const response = NextResponse.json({
        success: true,
        user: { email: ADMIN_EMAIL, name: ADMIN_NAME, role: ADMIN_ROLE },
      });

      // Set cookie for authorization mapping
      response.cookies.set('smr_admin_session', 'authorized', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Authentication server error' }, { status: 500 });
  }
}
