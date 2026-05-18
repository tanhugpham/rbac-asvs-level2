/**
 * Admin Page: User Management
 * Yêu cầu permission: user:read
 */

import { requirePermission } from '@/lib/auth';
import { PERMISSIONS } from '@/types/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import UserRoleManager from '@/components/UserRoleManager';

export default async function UsersPage() {
  // Kiểm tra quyền user:read
  const currentUser = await requirePermission(PERMISSIONS.USER_READ);

  // Lấy danh sách users
  const users = await prisma.user.findMany({
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

  // Lấy danh sách roles (nếu có quyền role:update)
  const canUpdateRoles = currentUser.permissions.includes(PERMISSIONS.ROLE_UPDATE) ||
                         currentUser.permissions.includes(PERMISSIONS.USER_UPDATE);

  const roles = canUpdateRoles
    ? await prisma.role.findMany({ orderBy: { name: 'asc' } })
    : [];

  return (
    <div className="container" style={{ paddingTop: '60px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/account" style={{ color: '#0070f3' }}>
          ← Back to Account
        </Link>
      </div>

      <div className="card">
        <h1 style={{ fontSize: '24px', marginBottom: '24px' }}>User Management</h1>

        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Roles</th>
              <th>Status</th>
              <th>Created</th>
              {canUpdateRoles && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.userRoles.map((ur) => (
                    <span
                      key={ur.id}
                      className={`badge badge-${ur.role.name.toLowerCase()}`}
                    >
                      {ur.role.name}
                    </span>
                  ))}
                </td>
                <td>
                  <span
                    style={{
                      color: user.isActive ? '#0a0' : '#e00',
                      fontWeight: 500,
                    }}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                {canUpdateRoles && (
                  <td>
                    <UserRoleManager
                      userId={user.id}
                      userEmail={user.email}
                      currentRoles={user.userRoles.map((ur) => ({
                        id: ur.role.id,
                        name: ur.role.name,
                      }))}
                      availableRoles={roles}
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
