'use client';

import { motion } from 'framer-motion';
import { Shield, ShieldAlert, ShieldCheck, ShieldX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SecurityBadgeProps {
  type: 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
  icon?: boolean;
  animate?: boolean;
  className?: string;
}

export function SecurityBadge({
  type,
  children,
  icon = true,
  animate = false,
  className,
}: SecurityBadgeProps) {
  const config = {
    success: {
      bg: 'bg-green-500/10',
      text: 'text-green-500',
      border: 'border-green-500/30',
      Icon: ShieldCheck,
    },
    warning: {
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-500',
      border: 'border-yellow-500/30',
      Icon: ShieldAlert,
    },
    error: {
      bg: 'bg-red-500/10',
      text: 'text-red-500',
      border: 'border-red-500/30',
      Icon: ShieldX,
    },
    info: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-500',
      border: 'border-blue-500/30',
      Icon: Shield,
    },
  };

  const { bg, text, border, Icon } = config[type];

  const Component = animate ? motion.div : 'div';
  const animationProps = animate
    ? {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { duration: 0.3 },
      }
    : {};

  return (
    <Component
      className={cn(
        'inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium',
        bg,
        text,
        border,
        className
      )}
      {...animationProps}
    >
      {icon && <Icon className="h-4 w-4" />}
      {children}
    </Component>
  );
}
