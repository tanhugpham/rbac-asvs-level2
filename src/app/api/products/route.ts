/**
 * API Route: Products
 * GET /api/products - Xem danh sách products (public, chỉ cần product:read)
 * POST /api/products - Tạo product mới (yêu cầu product:create)
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/auth';
import { PERMISSIONS } from '@/types/auth';
import { formatErrorResponse, ValidationError } from '@/lib/errors';

const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  stock: z.number().int().nonnegative('Stock must be non-negative'),
});

export async function GET() {
  try {
    // Product:read - tất cả user đã đăng nhập đều có thể xem
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      products,
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
    // Kiểm tra quyền product:create
    await requirePermission(PERMISSIONS.PRODUCT_CREATE, 'POST /api/products');

    const body = await request.json();
    const result = createProductSchema.safeParse(body);

    if (!result.success) {
      throw new ValidationError('Validation failed', result.error.issues);
    }

    const product = await prisma.product.create({
      data: result.data,
    });

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}
