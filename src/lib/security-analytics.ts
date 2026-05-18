/**
 * Security Analytics Helper
 * Generate analytics data from audit logs
 */

import { prisma } from './prisma';
import type { SecurityAnalytics, SecurityEvent } from '@/types/auth';
import { subDays, format, startOfDay, endOfDay } from 'date-fns';

/**
 * Get security analytics for dashboard
 */
export async function getSecurityAnalytics(days: number = 7): Promise<SecurityAnalytics> {
  try {
    const startDate = subDays(new Date(), days);

    // Get all audit logs in date range
    const logs = await prisma.auditLog.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
            userRoles: {
              include: {
                role: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate metrics
    const totalRequests = logs.length;
    const deniedRequests = logs.filter((log) => log.status === 'DENIED').length;
    const successfulRequests = logs.filter((log) => log.status === 'SUCCESS').length;
    const suspiciousRequests = logs.filter(
      (log) => log.action === 'ACCESS_DENIED' || log.action === 'SUSPICIOUS_ACTIVITY'
    ).length;

    // Get active users (users with activity in last 24 hours)
    const last24Hours = subDays(new Date(), 1);
    const activeUserIds = new Set(
      logs
        .filter((log) => log.createdAt >= last24Hours && log.userId)
        .map((log) => log.userId)
    );
    const activeUsers = activeUserIds.size;

    // Top denied permissions
    const deniedLogs = logs.filter((log) => log.status === 'DENIED' && log.permission);
    const permissionCounts = deniedLogs.reduce((acc, log) => {
      const perm = log.permission || 'unknown';
      acc[perm] = (acc[perm] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topDeniedPermissions = Object.entries(permissionCounts)
      .map(([permission, count]) => ({ permission, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Requests by day
    const requestsByDay: Array<{ date: string; success: number; denied: number }> = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);

      const dayLogs = logs.filter(
        (log) => log.createdAt >= dayStart && log.createdAt <= dayEnd
      );

      requestsByDay.push({
        date: format(date, 'MM/dd'),
        success: dayLogs.filter((log) => log.status === 'SUCCESS').length,
        denied: dayLogs.filter((log) => log.status === 'DENIED').length,
      });
    }

    // Role distribution
    const users = await prisma.user.findMany({
      where: { isActive: true },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    const roleCounts = users.reduce((acc, user) => {
      user.userRoles.forEach((ur) => {
        const roleName = ur.role.name;
        acc[roleName] = (acc[roleName] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const roleDistribution = Object.entries(roleCounts).map(([role, count]) => ({
      role,
      count,
    }));

    return {
      totalRequests,
      deniedRequests,
      successfulRequests,
      suspiciousRequests,
      activeUsers,
      topDeniedPermissions,
      requestsByDay,
      roleDistribution,
    };
  } catch (error) {
    console.error('[SECURITY ANALYTICS] Error:', error);
    // Return empty analytics on error
    return {
      totalRequests: 0,
      deniedRequests: 0,
      successfulRequests: 0,
      suspiciousRequests: 0,
      activeUsers: 0,
      topDeniedPermissions: [],
      requestsByDay: [],
      roleDistribution: [],
    };
  }
}

/**
 * Get recent security events
 */
export async function getRecentSecurityEvents(limit: number = 50): Promise<SecurityEvent[]> {
  try {
    const logs = await prisma.auditLog.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    return logs.map((log) => ({
      id: log.id,
      timestamp: log.createdAt,
      userId: log.userId || undefined,
      userEmail: log.user?.email,
      action: log.action,
      resource: log.resource || 'unknown',
      result: log.status as 'SUCCESS' | 'DENIED' | 'ERROR',
      severity: determineSeverity(log.action, log.status),
      ipAddress: log.ipAddress || undefined,
      userAgent: log.userAgent || undefined,
      details: log.details || undefined,
    }));
  } catch (error) {
    console.error('[SECURITY EVENTS] Error:', error);
    return [];
  }
}

/**
 * Determine severity based on action and status
 */
function determineSeverity(
  action: string,
  status: string
): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  if (status === 'DENIED') {
    if (action === 'ACCESS_DENIED' || action.includes('ROLE') || action.includes('PERMISSION')) {
      return 'HIGH';
    }
    return 'MEDIUM';
  }

  if (action === 'LOGIN' && status === 'SUCCESS') {
    return 'LOW';
  }

  if (action === 'SUSPICIOUS_ACTIVITY') {
    return 'CRITICAL';
  }

  if (action.includes('DELETE') || action.includes('UPDATE_ROLE')) {
    return 'MEDIUM';
  }

  return 'LOW';
}

/**
 * Log access denied event
 */
export async function logAccessDenied(
  userId: string,
  resource: string,
  permission: string,
  details?: string
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'ACCESS_DENIED',
        resource,
        permission,
        status: 'DENIED',
        details,
      },
    });
  } catch (error) {
    console.error('[LOG ACCESS DENIED] Error:', error);
  }
}
