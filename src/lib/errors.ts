/**
 * Custom Error Classes cho RBAC System
 * Tuân thủ OWASP ASVS Level 2 - Không để lộ thông tin nhạy cảm trong error messages
 */

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string,
    public isOperational = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 401 - Chưa xác thực
export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

// 403 - Không đủ quyền
export class ForbiddenError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403, 'FORBIDDEN');
  }
}

// 404 - Không tìm thấy (dùng để che giấu tài nguyên không thuộc về user)
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

// 400 - Dữ liệu không hợp lệ
export class ValidationError extends AppError {
  constructor(message = 'Validation failed', public errors?: any) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

// 409 - Conflict (email đã tồn tại, etc.)
export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409, 'CONFLICT');
  }
}

/**
 * Format error response cho API
 * Không trả stack trace ra client trong production
 */
export function formatErrorResponse(error: unknown) {
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        ...(error instanceof ValidationError && error.errors
          ? { errors: error.errors }
          : {}),
      },
    };
  }

  // Lỗi không xác định - không để lộ chi tiết
  console.error('Unexpected error:', error);
  return {
    success: false,
    error: {
      message: 'An unexpected error occurred',
      code: 'INTERNAL_ERROR',
      statusCode: 500,
    },
  };
}
