'use client';

import { useState, useEffect } from 'react';
import { SessionUser } from '@/types/auth';
import { WelcomeModal } from '@/components/WelcomeModal';
import { useRouter } from 'next/navigation';

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
      // Redirect to appropriate dashboard
      const primaryRole = user.roles[0];
      if (primaryRole === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (primaryRole === 'STAFF') {
        router.push('/staff/dashboard');
      } else if (primaryRole === 'CUSTOMER') {
        router.push('/account');
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [user.roles, router]);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    // Redirect to appropriate dashboard
    const primaryRole = user.roles[0];
    if (primaryRole === 'ADMIN') {
      router.push('/admin/dashboard');
    } else if (primaryRole === 'STAFF') {
      router.push('/staff/dashboard');
    } else if (primaryRole === 'CUSTOMER') {
      router.push('/account');
    }
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
