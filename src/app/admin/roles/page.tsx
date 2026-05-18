/**
 * Admin Page: Role Management
 * Yêu cầu permission: role:read
 */

import { requirePermission } from '@/lib/auth';
import { PERMISSIONS } from '@/types/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import RolePermissionManager from '@/components/RolePermissionManager';

export default async function RolesPage() {
  // Kiểm tra quyền role:read
  const currentUser = await requirePermission(PERMISSIONS.ROLE_READ);

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

  return (
    <div className="container" style={{ paddingTop: '60px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/account" style={{ color: '#0070f3' }}>
          ← Back to Account
        </Link>
      </div>

      <div className="card">
        <h1 style={{ fontSize: '24px', marginBottom: '24px' }}>Role Management</h1>

        {roles.map((role) => (
          <div
            key={role.id}
            style={{
              marginBottom: '32px',
              padding: '20px',
              background: '#f9f9f9',
              borderRadius: '8px',
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>
                <span className={`badge badge-${role.name.toLowerCase()}`}>
                  {role.name}
                </span>
              </h2>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                {role.description}
              </p>
              <p style={{ fontSize: '14px', color: '#666' }}>
                Users: {role._count.userRoles}
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>
                Permissions ({role.rolePermissions.length})
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {role.rolePermissions.map((rp) => (
                  <span
                    key={rp.id}
                    style={{
                      padding: '4px 8px',
                      background: 'white',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}
                  >
                    {rp.permission.name}
                  </span>
                ))}
              </div>
            </div>

            {canUpdateRoles && (
              <RolePermissionManager
                roleId={role.id}
                roleName={role.name}
                currentPermissions={role.rolePermissions.map((rp) => rp.permission.id)}
                allPermissions={allPermissions}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
