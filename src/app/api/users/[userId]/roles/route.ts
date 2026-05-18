/**
 * API Route: Assign/Remove User Roles
 * POST /api/users/[userId]/roles - Gán role cho user (yêu cầu user:update hoặc role:update)
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAnyPermission } from '@/lib/auth';
import { PERMISSIONS } from '@/types/auth';
import { formatErrorResponse, ValidationError, NotFoundError } from '@/lib/errors';
import { logSensitiveAction } from '@/lib/audit';

const assignRoleSchema = z.object({
  roleId: z.string().min(1, 'Role ID is required'),
  action: z.enum(['assign', 'remove']),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Kiểm tra quyền user:update hoặc role:update
    const currentUser = await requireAnyPermission(
      [PERMISSIONS.USER_UPDATE, PERMISSIONS.ROLE_UPDATE],
      `POST /api/users/${params.userId}/roles`
    );

    const body = await request.json();
    const result = assignRoleSchema.safeParse(body);

    if (!result.success) {
      throw new ValidationError('Validation failed', result.error.errors);
    }

    const { roleId, action } = result.data;
    const { userId } = params;

    // Kiểm tra user tồn tại
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Kiểm tra role tồn tại
    const role = await prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundError('Role not found');
    }

    if (action === 'assign') {
      // Gán role cho user
      await prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId,
            roleId,
          },
        },
        update: {},
        create: {
          userId,
          roleId,
        },
      });

      await logSensitiveAction(
        currentUser.id,
        'ROLE_ASSIGNED',
        `user:${userId}`,
        {
          targetUser: user.email,
          role: role.name,
        }
      );

      return NextResponse.json({
        success: true,
        message: `Role ${role.name} assigned to user ${user.email}`,
      });
    } else {
      // Xóa role khỏi user
      await prisma.userRole.delete({
        where: {
          userId_roleId: {
            userId,
            roleId,
          },
        },
      });

      await logSensitiveAction(
        currentUser.id,
        'ROLE_REMOVED',
        `user:${userId}`,
        {
          targetUser: user.email,
          role: role.name,
        }
      );

      return NextResponse.json({
        success: true,
        message: `Role ${role.name} removed from user ${user.email}`,
      });
    }
  } catch (error) {
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}
