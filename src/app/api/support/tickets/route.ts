/**
 * API Route: Support Tickets
 * POST /api/support/tickets - Tạo ticket hỗ trợ mới
 * GET /api/support/tickets - Xem danh sách tickets của user
 * 
 * Yêu cầu đăng nhập
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logSensitiveAction, logAuthorizationFailure } from '@/lib/audit';
import { formatErrorResponse, ValidationError } from '@/lib/errors';

const createTicketSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
  category: z.enum(['QUESTION', 'COMPLAINT', 'REQUEST', 'OTHER']).default('OTHER'),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      await logAuthorizationFailure(
        undefined,
        'POST /api/support/tickets',
        'auth:required',
        'User not authenticated'
      );
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = createTicketSchema.safeParse(body);

    if (!result.success) {
      throw new ValidationError('Validation failed', result.error.issues);
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: user.id,
        subject: result.data.subject,
        message: result.data.message,
        category: result.data.category,
        status: 'OPEN',
      },
    });

    // Ghi log
    await logSensitiveAction(user.id, 'USER_CREATED', `support_ticket:${ticket.id}`, {
      category: result.data.category,
      subject: result.data.subject.substring(0, 50),
    });

    return NextResponse.json({
      success: true,
      ticket: {
        id: ticket.id,
        subject: ticket.subject,
        category: ticket.category,
        status: ticket.status,
        createdAt: ticket.createdAt,
      },
    });
  } catch (error) {
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const tickets = await prisma.supportTicket.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        subject: true,
        category: true,
        status: true,
        message: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      tickets,
    });
  } catch (error) {
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}