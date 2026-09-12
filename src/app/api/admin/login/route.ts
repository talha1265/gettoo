import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const expectedEmail = process.env.ADMIN_EMAIL || 'admin@gettoo.atelier';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'atelier@admin2026';

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (
      email.trim().toLowerCase() === expectedEmail.toLowerCase() &&
      password.trim() === expectedPassword
    ) {
      return NextResponse.json({
        success: true,
        message: 'Admin authentication successful',
        user: {
          id: 'admin-01',
          name: 'Atelier Lead Admin',
          email: expectedEmail,
          role: 'ADMIN',
          phone: '+91 99999 88888',
        },
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid admin credentials' },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Authentication error' },
      { status: 500 }
    );
  }
}
