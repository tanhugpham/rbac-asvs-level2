/**
 * Admin Page: Role Management
 * Yêu cầu permission: role:read
 */

import { requirePermission } from '@/lib/auth';
import { PERMISSIONS } from '@/types/auth';
import { prisma } from '@/lib/prisma';
import { RolesPageClient } from './RolesPageClient';
import { redirect } from 'next/navigation';

export default async function RolesPage() {
  try {
    console.log('[ROLES PAGE] Loading...');

    // Kiểm tra quyền role:read
    const currentUser = await requirePermission(PERMISSIONS.ROLE_READ);

    console.log('[ROLES PAGE] User:', currentUser.email);

    // Lấy danh sách roles với permissions
    const roles = await prisma.role.findMany({
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
        _count: {
          select: {
            userRoles: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Lấy tất cả permissions
    const allPermissions = await prisma.permission.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    const canUpdateRoles = currentUser.permissions.includes(PERMISSIONS.ROLE_UPDATE);

    console.log('[ROLES PAGE] Loaded', roles.length, 'roles');

    return (
      <RolesPageClient
        roles={roles}
        allPermissions={allPermissions}
        canUpdateRoles={canUpdateRoles}
        currentUser={currentUser}
      />
    );
  } catch (error: any) {
    console.error('[ROLES PAGE] Error:', error);

    if (error.message?.includes('Permission denied') || error.message?.includes('required')) {
      redirect('/403?resource=Role Management&permission=role:read');
    }

    if (error.message?.includes('Authentication required')) {
      redirect('/login');
    }

    throw error;
  }
}
