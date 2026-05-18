import { requirePermission } from '@/lib/auth';
import { PERMISSIONS } from '@/types/auth';
import { AuthorizationFlow } from '@/components/security/AuthorizationFlow';
import { redirect } from 'next/navigation';

export default async function AuthFlowPage() {
  try {
    // Require AUDIT_READ permission (ADMIN only)
    await requirePermission(PERMISSIONS.AUDIT_READ);

    return (
      <div className="min-h-screen bg-security-bg bg-cyber-grid p-6">
        <div className="mx-auto max-w-7xl">
          <AuthorizationFlow />
        </div>
      </div>
    );
  } catch (error: any) {
    console.error('[AUTH FLOW] Error:', error);

    if (error.message?.includes('Permission denied') || error.message?.includes('required')) {
      redirect('/403?resource=Authorization Flow&permission=audit:read');
    }

    if (error.message?.includes('Authentication required')) {
      redirect('/login');
    }

    throw error;
  }
}
