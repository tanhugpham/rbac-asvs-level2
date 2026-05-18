'use client';

import { useState, useEffect } from 'react';
import { SessionUser } from '@/types/auth';
import { WelcomeModal } from '@/components/WelcomeModal';
import { useRouter } from 'next/navigation';
import type { Role } from "@/types/auth";
import { getDashboardPathFromRoles } from '@/lib/dashboard-routes';

interface AccountPageClientProps {
  user: SessionUser;
}

export function AccountPageClient({ user }: AccountPageClientProps) {
  const [showWelcome, setShowWelcome] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Auto-close welcome modal after 5 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false);
      // Redirect to appropriate dashboard using helper
      const dashboardPath = getDashboardPathFromRoles(user.roles as Role[]);
      router.push(dashboardPath);
    }, 5000);

    return () => clearTimeout(timer);
  }, [user.roles, router]);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    // Redirect to appropriate dashboard using helper
    const dashboardPath = getDashboardPathFromRoles(user.roles as Role[]);
    router.push(dashboardPath);
  };

  return (
    <div className="min-h-screen bg-security-bg bg-cyber-grid">
      <WelcomeModal 
        user={user} 
        isOpen={showWelcome} 
        onClose={handleCloseWelcome} 
      />
    </div>
  );
}
