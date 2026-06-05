/**
 * API Route: Update Role Permissions
 * POST /api/roles/[roleId]/permissions - Cập nhật permissions cho role (yêu cầu role:update)
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/auth';
import { PERMISSIONS } from '@/types/auth';
import { formatErrorResponse, ValidationError, NotFoundError } from '@/lib/errors';
import { logSensitiveAction } from '@/lib/audit';

const updatePermissionsSchema = z.object({
  permissionIds: z.array(z.string()).min(0, 'Permission IDs must be an array'),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { roleId: string } }
) {
  try {
    // Kiểm tra quyền role:update
    const user = await requirePermission(
      PERMISSIONS.ROLE_UPDATE,
      `POST /api/roles/${params.roleId}/permissions`
    );

    const body = await request.json();
    const result = updatePermissionsSchema.safeParse(body);

    if (!result.success) {
      throw new ValidationError('Validation failed', result.error.issues);
    }

    const { permissionIds } = result.data;
    const { roleId } = params;

    // Kiểm tra role tồn tại
    const role = await prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundError('Role not found');
    }

    // Xóa tất cả permissions cũ
    await prisma.rolePermission.deleteMany({
      where: { roleId },
    });

    // Thêm permissions mới
    if (permissionIds.length > 0) {
      await prisma.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({
          roleId,
          permissionId,
        })),
      });
    }

    // Log sensitive action
    await logSensitiveAction(
      user.id,
      'PERMISSION_GRANTED',
      `role:${roleId}`,
      {
        roleName: role.name,
        permissionCount: permissionIds.length,
      }
    );

    return NextResponse.json({
      success: true,
      message: `Permissions updated for role ${role.name}`,
    });
  } catch (error) {
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}
