/**
 * Audit Logging System
 * Tuân thủ OWASP ASVS Level 2 - Ghi log các hành vi bảo mật
 */

import { prisma } from './prisma';
import { headers } from 'next/headers';

export type AuditAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'ACCESS_DENIED'
  | 'PERMISSION_CHECK'
  | 'ROLE_ASSIGNED'
  | 'ROLE_REMOVED'
  | 'PERMISSION_GRANTED'
  | 'PERMISSION_REVOKED'
  | 'USER_CREATED'
  | 'USER_UPDATED'
  | 'USER_DELETED'
  | 'RESOURCE_ACCESS'
  // AI Chat Security
  

export type AuditStatus = 'SUCCESS' | 'DENIED' | 'ERROR';

interface AuditLogData {
  userId?: string;
  action: AuditAction;
  resource?: string;
  permission?: string;
  status: AuditStatus;
  details?: Record<string, any>;
}

/**
 * Ghi log audit
 */
export async function logAudit(data: AuditLogData): Promise<void> {
  try {
    // Lấy thông tin request từ headers
    const headersList = headers();
    const ipAddress = headersList.get('x-forwarded-for') || 
                      headersList.get('x-real-ip') || 
                      'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        resource: data.resource,
        permission: data.permission,
        status: data.status,
        ipAddress,
        userAgent,
        details: data.details ? JSON.stringify(data.details) : null,
      },
    });
  } catch (error) {
    // Không để lỗi audit log làm gián đoạn luồng chính
    console.error('Failed to write audit log:', error);
  }
}

/**
 * Ghi log khi authorization bị từ chối
 */
export async function logAuthorizationFailure(
  userId: string | undefined,
  resource: string,
  permission: string,
  reason?: string
): Promise<void> {
  await logAudit({
    userId,
    action: 'ACCESS_DENIED',
    resource,
    permission,
    status: 'DENIED',
    details: reason ? { reason } : undefined,
  });
}

/**
 * Ghi log các hành động nhạy cảm (thay đổi role, permission, etc.)
 */
export async function logSensitiveAction(
  userId: string,
  action: AuditAction,
  resource: string,
  details?: Record<string, any>
): Promise<void> {
  await logAudit({
    userId,
    action,
    resource,
    status: 'SUCCESS',
    details,
  });
}

/**
 * Ghi log đăng nhập
 */
export async function logLogin(
  userId: string,
  success: boolean,
  reason?: string
): Promise<void> {
  await logAudit({
    userId,
    action: 'LOGIN',
    status: success ? 'SUCCESS' : 'DENIED',
    details: reason ? { reason } : undefined,
  });
}
