/**
 * Admin Page: Audit Logs
 * Yêu cầu permission: audit:read
 * OWASP ASVS Level 2 - Comprehensive audit logging
 */

import { requirePermission } from '@/lib/auth';
import { PERMISSIONS } from '@/types/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { AuditLogsClient } from './AuditLogsClient';
import { formatDate } from '@/lib/utils';

export default async function AuditLogsPage() {
  try {
    console.log('[AUDIT LOGS] Loading page...');

    // Kiểm tra quyền audit:read (ADMIN only)
    await requirePermission(PERMISSIONS.AUDIT_READ);

    console.log('[AUDIT LOGS] Permission granted, fetching logs...');

    // Lấy audit logs (100 logs gần nhất)
    const logs = await prisma.auditLog.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });

    console.log('[AUDIT LOGS] Logs loaded:', logs.length);

    // Format logs for client (convert Date to string to avoid hydration issues)
    const formattedLogs = logs.map((log) => ({
      id: log.id,
      createdAt: formatDate(log.createdAt), // Format on server
      userId: log.userId,
      userName: log.user?.name || 'Unknown',
      userEmail: log.user?.email || 'Unknown',
      action: log.action,
      resource: log.resource || '-',
      permission: log.permission || '-',
      status: log.status,
      ipAddress: log.ipAddress || '-',
      details: log.details || null,
    }));

    return <AuditLogsClient logs={formattedLogs} />;
  } catch (error: any) {
    console.error('[AUDIT LOGS] Error:', error);

    if (error.message?.includes('Permission denied') || error.message?.includes('required')) {
      redirect('/403?resource=Audit Logs&permission=audit:read');
    }

    if (error.message?.includes('Authentication required')) {
      redirect('/login');
    }

    throw error;
  }
}
