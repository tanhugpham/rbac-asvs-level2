/**
 * API Route: Get Current User
 * GET /api/auth/me
 */

import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { formatErrorResponse } from '@/lib/errors';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({
        success: false,
        user: null,
      });
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}
