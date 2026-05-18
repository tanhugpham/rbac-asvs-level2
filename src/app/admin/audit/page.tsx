/**
 * Admin Page: Audit Logs
 * Yêu cầu permission: audit:read
 */

import { requirePermission } from '@/lib/auth';
import { PERMISSIONS } from '@/types/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AuditLogsPage() {
  // Kiểm tra quyền audit:read
  await requirePermission(PERMISSIONS.AUDIT_READ);

  // Lấy audit logs (100 logs gần nhất)
  const logs = await prisma.auditLog.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 100,
  });

  return (
    <div className="container" style={{ paddingTop: '60px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/account" style={{ color: '#0070f3' }}>
          ← Back to Account
        </Link>
      </div>

      <div className="card">
        <h1 style={{ fontSize: '24px', marginBottom: '24px' }}>
          Audit Logs (Last 100)
        </h1>

        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>User</th>
                <th>Action</th>
                <th>Resource</th>
                <th>Permission</th>
                <th>Status</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td style={{ fontSize: '12px' }}>
                    {log.user ? log.user.email : 'Unknown'}
                  </td>
                  <td style={{ fontSize: '12px' }}>
                    <span
                      style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 500,
                        background: '#f0f0f0',
                      }}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td style={{ fontSize: '12px' }}>{log.resource || '-'}</td>
                  <td style={{ fontSize: '12px' }}>{log.permission || '-'}</td>
                  <td style={{ fontSize: '12px' }}>
                    <span
                      style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 500,
                        background:
                          log.status === 'SUCCESS'
                            ? '#e8f5e9'
                            : log.status === 'DENIED'
                            ? '#ffebee'
                            : '#fff3e0',
                        color:
                          log.status === 'SUCCESS'
                            ? '#2e7d32'
                            : log.status === 'DENIED'
                            ? '#c62828'
                            : '#f57c00',
                      }}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '12px' }}>{log.ipAddress || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {logs.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
            No audit logs found
          </p>
        )}
      </div>
    </div>
  );
}
