import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getDashboardPath, DASHBOARD_ROUTES } from '@/lib/dashboard-routes';
import { ROLES } from '@/types/auth';
import { prisma } from '@/lib/prisma';
import { CustomerAccountDashboard } from '@/components/dashboards/CustomerAccountDashboard';

export default async function AccountPage() {
  try {
    console.log('[ACCOUNT PAGE] Loading...');
    
    const user = await getCurrentUser();

    if (!user) {
      console.log('[ACCOUNT PAGE] No user, redirect to login');
      redirect('/login');
    }

    console.log('[ACCOUNT PAGE] User:', user.email, 'Roles:', user.roles);

    const primaryRole = user.roles[0];

    // ADMIN and STAFF should go to their own dashboards
    if (primaryRole === ROLES.ADMIN) {
      console.log('[ACCOUNT PAGE] ADMIN detected, redirect to admin dashboard');
      redirect(DASHBOARD_ROUTES.ADMIN);
    }

    if (primaryRole === ROLES.STAFF) {
      console.log('[ACCOUNT PAGE] STAFF detected, redirect to staff dashboard');
      redirect(DASHBOARD_ROUTES.STAFF);
    }

    // CUSTOMER stays on /account page
    console.log('[ACCOUNT PAGE] CUSTOMER detected, showing account dashboard');

    // Fetch customer stats with error handling
    let stats = {
      totalOrders: 0,
      purchasedAccounts: 0,
      walletBalance: 0,
    };

    try {
      // Try to fetch orders count
      const ordersCount = await prisma.order.count({
        where: { userId: user.id }
      }).catch(() => 0);

      stats.totalOrders = ordersCount;
      
      // Try to fetch purchased accounts count (assuming orders with status COMPLETED)
      const purchasedCount = await prisma.order.count({
        where: { 
          userId: user.id,
          status: 'COMPLETED'
        }
      }).catch(() => 0);

      stats.purchasedAccounts = purchasedCount;

      console.log('[ACCOUNT PAGE] Stats loaded:', stats);
    } catch (error) {
      console.error('[ACCOUNT PAGE] Error loading stats:', error);
      // Continue with default stats (0)
    }

    return (
      <CustomerAccountDashboard 
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          roles: user.roles,
        }}
        stats={stats}
      />
    );
  } catch (error: any) {
    console.error('[ACCOUNT PAGE] Error:', error);

    // If not authenticated, redirect to login
    if (error.message?.includes('Authentication required')) {
      redirect('/login');
    }

    // Other errors, show error page
    throw error;
  }
}
