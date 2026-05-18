/**
 * Card Component - Glassmorphism Style
 */

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export function Card({ children, className, glow = false }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl',
        'shadow-xl transition-all duration-300',
        glow && 'hover:shadow-blue-500/20 hover:border-blue-500/30',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('p-6 pb-4', className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cn('text-xl font-semibold text-white', className)}>{children}</h3>;
}

export function CardDescription({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('text-sm text-gray-400 mt-1', className)}>{children}</p>;
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('p-6 pt-0', className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('p-6 pt-0', className)}>{children}</div>;
}
