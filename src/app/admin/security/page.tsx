import { requirePermission } from '@/lib/auth';
import { PERMISSIONS } from '@/types/auth';
import { SecurityVisualization } from '@/components/SecurityVisualization';

export const dynamic = 'force-dynamic';

export default async function SecurityPage() {
  // Require audit read permission
  await requirePermission(PERMISSIONS.AUDIT_READ);
  
  return <SecurityVisualization />;
}
