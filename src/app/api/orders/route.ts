/**
 * API Route: Orders
 * GET /api/orders - Xem danh sách orders
 * POST /api/orders - Tạo đơn hàng mới (Buy Now / Add to Cart)
 * 
 * Authorization:
 * - GET: ADMIN/STAFF có order:read hoặc order:manage: xem tất cả orders
 *        CUSTOMER có order:read_own: chỉ xem orders của chính mình
 * - POST: Yêu cầu order:create (CUSTOMER, STAFF, ADMIN đều có)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requirePermission } from '@/lib/auth';
import { PERMISSIONS } from '@/types/auth';
import { formatErrorResponse, ValidationError, NotFoundError } from '@/lib/errors';
import { z } from 'zod';

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1, 'Product ID is required'),
      quantity: z.number().int().positive('Quantity must be positive'),
    })
  ).min(1, 'At least one item is required'),
});

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

export async function POST(request: NextRequest) {
  try {
    // Yêu cầu quyền order:create
    const user = await requirePermission(
      PERMISSIONS.ORDER_CREATE,
      'POST /api/orders'
    );

    const body = await request.json();
    const result = createOrderSchema.safeParse(body);

    if (!result.success) {
      throw new ValidationError('Validation failed', result.error.issues);
    }

    const { items } = result.data;

    // Kiểm tra sản phẩm tồn tại và còn hàng
    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundError('One or more products not found');
    }

    // Kiểm tra tồn kho
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new NotFoundError(`Product not found: ${item.productId}`);
      }
      if (product.stock < item.quantity) {
        throw new ValidationError(
          `Insufficient stock for ${product.name}. Available: ${product.stock}, requested: ${item.quantity}`
        );
      }
    }

    // Tính tổng tiền
    let totalAmount = 0;
    const orderItemsData = items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });

    // Tạo order trong transaction
    const order = await prisma.$transaction(async (tx) => {
      // Tạo order
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          totalAmount,
          status: 'PENDING',
          orderItems: {
            create: orderItemsData,
          },
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      // Cập nhật tồn kho
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    return NextResponse.json(
      {
        success: true,
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}