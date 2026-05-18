/**
 * Admin Page: User Management
 * Yêu cầu permission: user:read
 */

import { requirePermission } from '@/lib/auth';
import { PERMISSIONS } from '@/types/auth';
import { prisma } from '@/lib/prisma';
import { UsersPageClient } from './UsersPageClient';
import { redirect } from 'next/navigation';

export default async function UsersPage() {
  try {
    console.log('[USERS PAGE] Loading...');

    // Kiểm tra quyền user:read
    const currentUser = await requirePermission(PERMISSIONS.USER_READ);

    console.log('[USERS PAGE] User:', currentUser.email);

    // Lấy danh sách users (chỉ users mới với @gmail.com/@hotmail.com)
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: '@gmail.com' } },
          { email: { contains: '@hotmail.com' } },
        ],
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('[USERS PAGE] Loaded', users.length, 'users');

    // Lấy danh sách roles (nếu có quyền role:update)
    const canUpdateRoles =
      currentUser.permissions.includes(PERMISSIONS.ROLE_UPDATE) ||
      currentUser.permissions.includes(PERMISSIONS.USER_UPDATE);

    const roles = canUpdateRoles
      ? await prisma.role.findMany({ orderBy: { name: 'asc' } })
      : [];

    return (
      <UsersPageClient
        users={users}
        roles={roles}
        canUpdateRoles={canUpdateRoles}
        currentUser={currentUser}
      />
    );
  } catch (error: any) {
    console.error('[USERS PAGE] Error:', error);

    if (error.message?.includes('Permission denied') || error.message?.includes('required')) {
      redirect('/403?resource=User Management&permission=user:read');
    }

    if (error.message?.includes('Authentication required')) {
      redirect('/login');
    }

    throw error;
  }
}
