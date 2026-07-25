import { NextResponse } from 'next/server';

// Admin Database User Store
const ADMIN_USER = {
  email: 'admin@smriti.com',
  password: 'wrongpassword', // Enforced admin credentials from request
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
      return NextResponse.json({
        success: true,
        user: {
          email: ADMIN_USER.email,
          name: ADMIN_USER.name,
          role: ADMIN_USER.role,
        },
        token: `admin_session_${Date.now()}`,
      });
    }

    return NextResponse.json({ error: 'Invalid email or password credentials.' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Authentication server error' }, { status: 500 });
  }
}
