/**
 * UI Utility Functions
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date for display (server-safe, no hydration issues)
 * Uses fixed locale and timezone to prevent hydration mismatch
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh',
    hour12: false,
  }).format(d);
}

/**
 * Get avatar color based on role
 */
export function getAvatarColor(role: string): string {
  const colors = {
    ADMIN: 'from-blue-500 to-purple-600',
    STAFF: 'from-purple-500 to-pink-600',
    CUSTOMER: 'from-green-500 to-teal-600',
  };
  return colors[role as keyof typeof colors] || 'from-gray-500 to-gray-600';
}

/**
 * Get security level based on permissions count
 */
export function getSecurityLevel(permissionsCount: number): {
  level: string;
  color: string;
  description: string;
} {
  if (permissionsCount >= 14) {
    return {
      level: 'CRITICAL',
      color: 'text-red-500',
      description: 'Full System Access',
    };
  } else if (permissionsCount >= 7) {
    return {
      level: 'HIGH',
      color: 'text-orange-500',
      description: 'Elevated Privileges',
    };
  } else if (permissionsCount >= 3) {
    return {
      level: 'MEDIUM',
      color: 'text-yellow-500',
      description: 'Standard Access',
    };
  } else {
    return {
      level: 'LOW',
      color: 'text-green-500',
      description: 'Limited Access',
    };
  }
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('vi-VN').format(num);
}

/**
 * Get severity color
 */
export function getSeverityColor(severity: string): string {
  const colors = {
    LOW: 'text-green-500 bg-green-500/10',
    MEDIUM: 'text-yellow-500 bg-yellow-500/10',
    HIGH: 'text-orange-500 bg-orange-500/10',
    CRITICAL: 'text-red-500 bg-red-500/10',
  };
  return colors[severity as keyof typeof colors] || 'text-gray-500 bg-gray-500/10';
}

/**
 * Get status color
 */
export function getStatusColor(status: string): string {
  const colors = {
    SUCCESS: 'text-green-500 bg-green-500/10',
    DENIED: 'text-red-500 bg-red-500/10',
    ERROR: 'text-orange-500 bg-orange-500/10',
    PENDING: 'text-yellow-500 bg-yellow-500/10',
  };
  return colors[status as keyof typeof colors] || 'text-gray-500 bg-gray-500/10';
}
