import { NextResponse } from 'next/server';

const ADMIN_USER = {
  email: 'admin@smriti.com',
  password: 'wrongpassword',
  name: 'Smriti Shah Admin',
  role: 'ADMIN',
};

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (email.toLowerCase() === ADMIN_USER.email.toLowerCase() && password === ADMIN_USER.password) {
      const response = NextResponse.json({
        success: true,
        user: { email: ADMIN_USER.email, name: ADMIN_USER.name, role: ADMIN_USER.role },
      });

      // Non-httpOnly so the client JS can also read/write it for sync
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
