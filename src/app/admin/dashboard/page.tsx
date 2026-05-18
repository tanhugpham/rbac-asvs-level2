import { requireRole } from '@/lib/auth';
import { ROLES } from '@/types/auth';
import { prisma } from '@/lib/prisma';
import { AdminDashboard } from '@/components/dashboards/AdminDashboard';
import { redirect } from 'next/navigation';

export default async function AdminDashboardPage() {
  try {
    console.log('[ADMIN DASHBOARD] Loading...');
    
    // Require ADMIN role
    const user = await requireRole(ROLES.ADMIN);
    console.log('[ADMIN DASHBOARD] User:', user.email, 'Roles:', user.roles);
    
    // Fetch statistics with error handling
    let stats = {
      totalUsers: 0,
      totalRoles: 0,
      totalPermissions: 0,
      deniedAttempts: 0,
    };
    let recentLogs: any[] = [];

    try {
      const [totalUsers, totalRoles, totalPermissions, deniedAttempts, logs] = await Promise.all([
        prisma.user.count().catch(() => 0),
        prisma.role.count().catch(() => 0),
        prisma.permission.count().catch(() => 0),
        prisma.auditLog.count({
          where: { 
            action: { contains: 'DENIED' }
          }
        }).catch(() => 0),
        prisma.auditLog.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                name: true,
                email: true,
              }
            }
          }
        }).catch(() => [])
      ]);
      
      stats = {
        totalUsers,
        totalRoles,
        totalPermissions,
        deniedAttempts,
      };
      recentLogs = logs;
      
      console.log('[ADMIN DASHBOARD] Stats loaded:', stats);
    } catch (error) {
      console.error('[ADMIN DASHBOARD] Error loading stats:', error);
      // Continue with default stats
    }
    
    return <AdminDashboard stats={stats} recentLogs={recentLogs} />;
  } catch (error: any) {
    console.error('[ADMIN DASHBOARD] Error:', error);
    
    // If unauthorized, redirect to 403
    if (error.message?.includes('Permission denied') || error.message?.includes('Role required')) {
      redirect('/403');
    }
    
    // If not authenticated, redirect to login
    if (error.message?.includes('Authentication required')) {
      redirect('/login');
    }
    
    // Other errors, show error page
    throw error;
  }
}
