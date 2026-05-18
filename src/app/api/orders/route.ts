/**
 * API Route: Orders
 * GET /api/orders - Xem danh sách orders
 * 
 * Authorization:
 * - ADMIN/STAFF có order:read hoặc order:manage: xem tất cả orders
 * - CUSTOMER có order:read_own: chỉ xem orders của chính mình
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { PERMISSIONS } from '@/types/auth';
import { formatErrorResponse } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    // Yêu cầu đăng nhập
    const user = await requireAuth();

    // Kiểm tra quyền
    const canReadAll =
      user.permissions.includes(PERMISSIONS.ORDER_READ) ||
      user.permissions.includes(PERMISSIONS.ORDER_MANAGE);

    const canReadOwn = user.permissions.includes(PERMISSIONS.ORDER_READ_OWN);

    if (!canReadAll && !canReadOwn) {
      // Không có quyền nào
      throw new Error('Access denied');
    }

    // Query orders dựa trên quyền
    const orders = await prisma.order.findMany({
      where: canReadAll
        ? {} // Admin/Staff xem tất cả
        : { userId: user.id }, // Customer chỉ xem của mình
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}
