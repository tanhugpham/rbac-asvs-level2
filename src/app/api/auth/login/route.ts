/**
 * API Route: Login
 * POST /api/auth/login
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { comparePassword } from '@/lib/password';
import { signToken } from '@/lib/jwt';
import { formatErrorResponse, ValidationError, UnauthorizedError } from '@/lib/errors';
import { logLogin } from '@/lib/audit';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    console.log('[LOGIN API] Request received');
    const body = await request.json();
    console.log('[LOGIN API] Email:', body.email);

    // Validate input
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      console.log('[LOGIN API] Validation failed:', result.error.errors);
      throw new ValidationError('Validation failed', result.error.errors);
    }

    const { email, password } = result.data;

    // Tìm user với roles và permissions
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || !user.isActive) {
      console.log('[LOGIN API] User not found or inactive');
      await logLogin(user?.id || 'unknown', false, 'Invalid credentials');
      throw new UnauthorizedError('Invalid email or password');
    }

    // Kiểm tra password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      console.log('[LOGIN API] Invalid password');
      await logLogin(user.id, false, 'Invalid password');
      throw new UnauthorizedError('Invalid email or password');
    }

    // Tổng hợp roles và permissions
    const roles = user.userRoles.map((ur) => ur.role.name);
    const permissionsSet = new Set<string>();
    user.userRoles.forEach((ur) => {
      ur.role.rolePermissions.forEach((rp) => {
        permissionsSet.add(rp.permission.name);
      });
    });
    const permissions = Array.from(permissionsSet);

    console.log('[LOGIN API] User roles:', roles);
    console.log('[LOGIN API] User permissions count:', permissions.length);

    // Xác định redirect URL dựa trên role
    let redirectTo = '/account';
    const primaryRole = roles[0];
    if (primaryRole === 'ADMIN') {
      redirectTo = '/admin/dashboard';
    } else if (primaryRole === 'STAFF') {
      redirectTo = '/staff/dashboard';
    } else if (primaryRole === 'CUSTOMER') {
      redirectTo = '/account';
    }

    console.log('[LOGIN API] Redirect to:', redirectTo);

    // Tạo JWT token
    const token = signToken({
      userId: user.id,
      email: user.email,
    });

    // Log successful login
    await logLogin(user.id, true);

    console.log('[LOGIN API] Token created, setting cookie');

    // Prepare response
    const responseData = {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles,
        permissions,
      },
      redirectTo,
    };

    console.log('[LOGIN API] Success!');

    // Create response with cookie
    const response = NextResponse.json(responseData);
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    console.log('[LOGIN API] Cookie set: auth-token');
    return response;
  } catch (error) {
    console.error('[LOGIN API] Error:', error);
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}
