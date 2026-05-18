import { requireRole } from '@/lib/auth';
import { ROLES } from '@/types/auth';
import { prisma } from '@/lib/prisma';
import { StaffDashboard } from '@/components/dashboards/StaffDashboard';
import { redirect } from 'next/navigation';

export default async function StaffDashboardPage() {
  try {
    console.log('[STAFF DASHBOARD] Loading...');
    
    // Require STAFF role (ADMIN can also access)
    const user = await requireRole(ROLES.STAFF);
    console.log('[STAFF DASHBOARD] User:', user.email, 'Roles:', user.roles);
    
    // Fetch statistics with error handling
    let stats = {
      totalProducts: 0,
      totalOrders: 0,
      pendingOrders: 0,
    };

    try {
      const [totalProducts, totalOrders, pendingOrders] = await Promise.all([
        prisma.product.count().catch(() => 0),
        prisma.order.count().catch(() => 0),
        prisma.order.count({
          where: { status: 'PENDING' }
        }).catch(() => 0),
      ]);
      
      stats = {
        totalProducts,
        totalOrders,
        pendingOrders,
      };
      
      console.log('[STAFF DASHBOARD] Stats loaded:', stats);
    } catch (error) {
      console.error('[STAFF DASHBOARD] Error loading stats:', error);
      // Continue with default stats (0)
    }
    
    return <StaffDashboard stats={stats} />;
  } catch (error: any) {
    console.error('[STAFF DASHBOARD] Error:', error);
    
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
