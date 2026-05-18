'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

interface LogoutButtonProps {
  variant?: 'default' | 'sidebar' | 'icon';
  className?: string;
}

export function LogoutButton({ variant = 'default', className = '' }: LogoutButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      console.log('[LOGOUT] Starting logout...');

      // Call logout API
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        console.log('[LOGOUT] Logout successful, redirecting to /login');
        
        // Redirect to login
        router.push('/login');
        
        // Force refresh to clear any cached data
        router.refresh();
      } else {
        console.error('[LOGOUT] Logout failed:', data.error);
        alert('Logout failed. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('[LOGOUT] Error:', error);
      alert('Logout failed. Please try again.');
      setIsLoading(false);
    }
  };

  // Icon only variant
  if (variant === 'icon') {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLogout}
        disabled={isLoading}
        className={`flex items-center justify-center rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        title="Đăng xuất"
      >
        {isLoading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
        ) : (
          <LogOut className="h-5 w-5" />
        )}
      </motion.button>
    );
  }

  // Sidebar variant
  if (variant === 'sidebar') {
    return (
      <motion.button
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleLogout}
        disabled={isLoading}
        className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      >
        {isLoading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
        ) : (
          <LogOut className="h-5 w-5" />
        )}
        <span className="font-medium">Đăng xuất</span>
      </motion.button>
    );
  }

  // Default variant (button)
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleLogout}
      disabled={isLoading}
      className={`flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 font-medium text-red-500 transition-all hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {isLoading ? (
        <>
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
          <span>Đang đăng xuất...</span>
        </>
      ) : (
        <>
          <LogOut className="h-5 w-5" />
          <span>Đăng xuất</span>
        </>
      )}
    </motion.button>
  );
}
