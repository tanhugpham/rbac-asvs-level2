/**
 * API Route: Roles Management
 * GET /api/roles - Xem danh sách roles và permissions (yêu cầu role:read)
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/auth';
import { PERMISSIONS } from '@/types/auth';
import { formatErrorResponse } from '@/lib/errors';

export async function GET() {
  try {
    // Kiểm tra quyền role:read
    await requirePermission(PERMISSIONS.ROLE_READ, 'GET /api/roles');

    // Lấy danh sách roles với permissions
    const roles = await prisma.role.findMany({
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
        _count: {
          select: {
            userRoles: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Format response
    const formattedRoles = roles.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description,
      userCount: role._count.userRoles,
      permissions: role.rolePermissions.map((rp) => ({
        id: rp.permission.id,
        name: rp.permission.name,
        description: rp.permission.description,
      })),
    }));

    return NextResponse.json({
      success: true,
      roles: formattedRoles,
    });
  } catch (error) {
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}
