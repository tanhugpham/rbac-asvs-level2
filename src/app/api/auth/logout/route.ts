/**
 * API Route: Logout
 * POST /api/auth/logout
 */

import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function POST() {
  try {
    const user = await getCurrentUser();

    if (user) {
      await logAudit({
        userId: user.id,
        action: 'LOGOUT',
        status: 'SUCCESS',
      });
    }

    console.log('[LOGOUT API] Clearing auth-token cookie');

    // Clear cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error('[LOGOUT API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}
