/**
 * API Route: AI Chat
 * POST /api/ai/chat - Gửi câu hỏi AI để tra cứu sản phẩm
 * 
 * Security:
 * - Yêu cầu đăng nhập
 * - Audit logging mọi request
 * - Input validation chống prompt injection
 * - Rate limiting
 * - Kết nối đến MCP DeepSeek Server
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { formatErrorResponse } from '@/lib/errors';

const MCP_BASE_URL = process.env.MCP_DEEPSEEK_URL || 'http://localhost:4000';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Lấy thông tin user - authentication check
    const user = await getCurrentUser();

    // LAYER 1: Authentication check
    if (!user) {
      // Ghi log unauthorized access attempt
      await logAudit({
        action: 'AI_UNAUTHORIZED_ACCESS',
        resource: '/api/ai/chat',
        status: 'DENIED',
        details: {
          reason: 'User not authenticated',
          ip: request.headers.get('x-forwarded-for') || 'unknown',
        },
      });

      return NextResponse.json(
        { 
          success: false, 
          error: 'Vui lòng đăng nhập để sử dụng tính năng tra cứu AI.',
          requiresAuth: true,
        },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // Ghi log request bắt đầu
    await logAudit({
      userId: user.id,
      action: 'AI_CHAT_REQUEST',
      resource: '/api/ai/chat',
      status: 'SUCCESS',
      details: {
        messageLength: message.length,
        preview: message.substring(0, 100),
      },
    });

    // Gọi MCP server để xử lý với security guards
    let result;
    try {
      const mcpResponse = await fetch(`${MCP_BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          message,
          sessionId: `${user.id}-${Date.now()}`,
        }),
        signal: AbortSignal.timeout(10000), // 10 seconds timeout
      });

      if (mcpResponse.ok) {
        result = await mcpResponse.json();
      } else {
        throw new Error(`MCP server error: ${mcpResponse.status}`);
      }
    } catch (mcpError) {
      // Fallback khi MCP server không available
      // Trả về response mặc định friendly
      console.warn('[AI Chat] MCP server unavailable, using fallback:', mcpError);
      result = {
        success: true,
        message: `Xin chào ${user.name || 'bạn'}, tôi là trợ lý tra cứu sản phẩm.\n\nHiện tại tôi có thể giúp bạn tìm kiếm sản phẩm. Hãy cho tôi biết bạn muốn tìm sản phẩm gì?\n\nVí dụ: "tìm sản phẩm giá rẻ", "có sản phẩm gì mới", "tra cứu sản phẩm A"`,
        data: null,
        remaining: 9,
      };
    }

    // Kiểm tra response có bị từ chối không (prompt injection detected)
    if (!result.success) {
      await logAudit({
        userId: user.id,
        action: 'AI_CHAT_DENIED',
        resource: '/api/ai/chat',
        status: 'DENIED',
        details: {
          reason: result.error,
          inputPreview: message.substring(0, 100),
        },
      });
    } else {
      // Log success
      await logAudit({
        userId: user.id,
        action: 'AI_CHAT_SUCCESS',
        resource: '/api/ai/chat',
        status: 'SUCCESS',
        details: {
          responseTime: Date.now() - startTime,
          productCount: result.data?.total || 0,
        },
      });
    }

    return NextResponse.json({
      success: result.success,
      message: result.message,
      data: result.data,
      remaining: result.remaining,
    });

  } catch (error) {
    console.error('[AI Chat] Error:', error);
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error.statusCode,
    });
  }
}