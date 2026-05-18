import { requirePermission } from '@/lib/auth';
import { PERMISSIONS } from '@/types/auth';
import { RBACMatrix } from '@/components/security/RBACMatrix';
import { redirect } from 'next/navigation';

export default async function RBACMatrixPage() {
  try {
    // Require ROLE_READ permission (ADMIN only)
    await requirePermission(PERMISSIONS.ROLE_READ);

    return (
      <div className="min-h-screen bg-security-bg bg-cyber-grid p-6">
        <div className="mx-auto max-w-7xl">
          <RBACMatrix />
        </div>
      </div>
    );
  } catch (error: any) {
    console.error('[RBAC MATRIX] Error:', error);

    if (error.message?.includes('Permission denied') || error.message?.includes('required')) {
      redirect('/403?resource=RBAC Matrix&permission=role:read');
    }

    if (error.message?.includes('Authentication required')) {
      redirect('/login');
    }

    throw error;
  }
}
