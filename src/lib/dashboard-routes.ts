/**
 * Dashboard Route Helper
 * Centralized dashboard path management to avoid hardcoding routes
 */

import { Role, ROLES } from '@/types/auth';

// Re-export ROLES for convenience
export { ROLES };

/**
 * Get dashboard path for a given role
 * @param role - User role (ADMIN, STAFF, CUSTOMER)
 * @returns Dashboard path for the role
 */
export function getDashboardPath(role: Role): string {
  switch (role) {
    case ROLES.ADMIN:
      return '/admin/dashboard';
    case ROLES.STAFF:
      return '/staff/dashboard';
    case ROLES.CUSTOMER:
      return '/account';
    default:
      return '/account'; // Fallback to account page
  }
}

/**
 * Get dashboard path for user with multiple roles
 * Uses the first (primary) role
 * @param roles - Array of user roles
 * @returns Dashboard path for primary role
 */
export function getDashboardPathFromRoles(roles: Role[]): string {
  if (!roles || roles.length === 0) {
    return '/account'; // Fallback
  }
  return getDashboardPath(roles[0]);
}

/**
 * Dashboard route constants
 */
export const DASHBOARD_ROUTES = {
  ADMIN: '/admin/dashboard',
  STAFF: '/staff/dashboard',
  CUSTOMER: '/account',
} as const;

/**
 * Check if a path is a dashboard route
 * @param path - Path to check
 * @returns True if path is a dashboard route
 */
export function isDashboardRoute(path: string): boolean {
  return Object.values(DASHBOARD_ROUTES).includes(path as any);
}
