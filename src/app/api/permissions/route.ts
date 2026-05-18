/**
 * API Route: Permissions
 * GET /api/permissions - Xem danh sách tất cả permissions (yêu cầu role:read)
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/auth';
import { PERMISSIONS } from '@/types/auth';
import { formatErrorResponse } from '@/lib/errors';

export async function GET() {
  try {
    // Kiểm tra quyền role:read
    await requirePermission(PERMISSIONS.ROLE_READ, 'GET /api/permissions');

    const permissions = await prisma.permission.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      permissions,
    });
  } catch (error) {
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}
