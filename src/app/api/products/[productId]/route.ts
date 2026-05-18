/**
 * API Route: Product Management
 * DELETE /api/products/[productId] - Xóa product (yêu cầu product:delete)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/auth';
import { PERMISSIONS } from '@/types/auth';
import { formatErrorResponse, NotFoundError } from '@/lib/errors';
import { logSensitiveAction } from '@/lib/audit';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    // Kiểm tra quyền product:delete
    const user = await requirePermission(
      PERMISSIONS.PRODUCT_DELETE,
      `DELETE /api/products/${params.productId}`
    );

    const { productId } = params;

    // Kiểm tra product tồn tại
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    // Soft delete - set isActive = false
    await prisma.product.update({
      where: { id: productId },
      data: { isActive: false },
    });

    // Log sensitive action
    await logSensitiveAction(user.id, 'USER_DELETED', `product:${productId}`, {
      productName: product.name,
    });

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}
