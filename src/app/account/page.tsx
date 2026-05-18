import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { ROLES } from '@/types/auth';
import { AccountPageClient } from './AccountPageClient';

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Redirect to role-specific dashboard
  const primaryRole = user.roles[0];
  
  if (primaryRole === ROLES.ADMIN) {
    redirect('/admin/dashboard');
  } else if (primaryRole === ROLES.STAFF) {
    redirect('/staff/dashboard');
  } else if (primaryRole === ROLES.CUSTOMER) {
    redirect('/account');
  }

  // Fallback: show account page with welcome modal
  return <AccountPageClient user={user} />;
}
