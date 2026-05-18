import { requirePermission } from '@/lib/auth';
import { PERMISSIONS } from '@/types/auth';
import { SecurityAnalyticsDashboard } from '@/components/security/SecurityAnalyticsDashboard';
import { LogoutButton } from '@/components/LogoutButton';
import { getSecurityAnalytics } from '@/lib/security-analytics';
import { redirect } from 'next/navigation';

export default async function SecurityAnalyticsPage() {
  try {
    console.log('[SECURITY ANALYTICS] Loading page...');

    // Require AUDIT_READ permission (ADMIN only)
    await requirePermission(PERMISSIONS.AUDIT_READ);

    console.log('[SECURITY ANALYTICS] Permission granted, fetching analytics...');

    // Get analytics for last 7 days
    const analytics = await getSecurityAnalytics(7);

    console.log('[SECURITY ANALYTICS] Analytics loaded:', {
      totalRequests: analytics.totalRequests,
      deniedRequests: analytics.deniedRequests,
    });

    return (
      <div className="min-h-screen bg-security-bg bg-cyber-grid p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Security Analytics</h1>
              <p className="text-gray-400">
                Real-time security metrics and access patterns - Last 7 days
              </p>
            </div>
            <LogoutButton variant="default" />
          </div>
          <SecurityAnalyticsDashboard analytics={analytics} />
        </div>
      </div>
    );
  } catch (error: any) {
    console.error('[SECURITY ANALYTICS] Error:', error);

    if (error.message?.includes('Permission denied') || error.message?.includes('required')) {
      redirect('/403?resource=Security Analytics&permission=audit:read');
    }

    if (error.message?.includes('Authentication required')) {
      redirect('/login');
    }

    throw error;
  }
}
