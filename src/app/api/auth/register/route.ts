/**
 * API Route: Register
 * POST /api/auth/register
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword, validatePasswordStrength } from '@/lib/password';
import { signToken } from '@/lib/jwt';
import { formatErrorResponse, ValidationError, ConflictError } from '@/lib/errors';
import { logSensitiveAction } from '@/lib/audit';
import { serialize } from 'cookie';
import { ROLES } from '@/types/auth';

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      throw new ValidationError('Validation failed', result.error.errors);
    }

    const { email, password, name } = result.data;

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      throw new ValidationError('Weak password', passwordValidation.errors);
    }

    // Kiểm tra email đã tồn tại
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError('Email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Tạo user mới với role CUSTOMER mặc định
    const customerRole = await prisma.role.findUnique({
      where: { name: ROLES.CUSTOMER },
    });

    if (!customerRole) {
      throw new Error('Customer role not found. Please run seed script.');
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        isActive: true,
        userRoles: {
          create: {
            roleId: customerRole.id,
          },
        },
      },
    });

    // Log user creation
    await logSensitiveAction(user.id, 'USER_CREATED', `user:${user.id}`, {
      email: user.email,
    });

    // Tạo JWT token
    const token = signToken({
      userId: user.id,
      email: user.email,
    });

    // Set cookie
    const cookie = serialize('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

    response.headers.set('Set-Cookie', cookie);
    return response;
  } catch (error) {
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}
