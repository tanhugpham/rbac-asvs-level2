/**
 * API Route: Order Detail
 * GET /api/orders/[orderId] - Xem chi tiết order
 * 
 * Authorization:
 * - Chủ sở hữu order hoặc user có order:read
 * - Nếu không phải chủ sở hữu và không có quyền: trả về 404 (che giấu tài nguyên)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { PERMISSIONS } from '@/types/auth';
import { formatErrorResponse, NotFoundError } from '@/lib/errors';
import { logAuthorizationFailure } from '@/lib/audit';

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const user = await requireAuth();
    const { orderId } = params;

    // Lấy order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
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
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    // Kiểm tra quyền
    const isOwner = order.userId === user.id;
    const hasReadPermission =
      user.permissions.includes(PERMISSIONS.ORDER_READ) ||
      user.permissions.includes(PERMISSIONS.ORDER_MANAGE);

    if (!isOwner && !hasReadPermission) {
      // Không phải chủ sở hữu và không có quyền
      // Trả về 404 để che giấu sự tồn tại của order
      await logAuthorizationFailure(
        user.id,
        `order:${orderId}`,
        PERMISSIONS.ORDER_READ,
        'Not owner and no permission'
      );
      throw new NotFoundError('Order not found');
    }

    // Kiểm tra quyền xem account secret
    const canReadSecret = user.permissions.includes(
      PERMISSIONS.ACCOUNT_READ_SECRET
    );

    // Format response - ẩn account secret nếu không có quyền
    const formattedOrder = {
      ...order,
      orderItems: order.orderItems.map((item) => ({
        ...item,
        accountSecret:
          isOwner || canReadSecret ? item.accountSecret : '[REDACTED]',
      })),
    };

    return NextResponse.json({
      success: true,
      order: formattedOrder,
    });
  } catch (error) {
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}
