/**
 * Order Detail Page
 * Authorization:
 * - Chủ sở hữu order hoặc user có order:read
 * - Account secret chỉ hiển thị cho chủ sở hữu hoặc user có account:read_secret
 */

import { requireAuth } from '@/lib/auth';
import { PERMISSIONS } from '@/types/auth';
import { prisma } from '@/lib/prisma';
import { NotFoundError } from '@/lib/errors';
import { logAuthorizationFailure } from '@/lib/audit';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function OrderDetailPage({
  params,
}: {
  params: { orderId: string };
}) {
  const user = await requireAuth();
  const { orderId } = params;

  // Lấy order
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    redirect('/403');
  }

  // Kiểm tra quyền
  const isOwner = order.userId === user.id;
  const hasReadPermission =
    user.permissions.includes(PERMISSIONS.ORDER_READ) ||
    user.permissions.includes(PERMISSIONS.ORDER_MANAGE);

  if (!isOwner && !hasReadPermission) {
    // Không phải chủ sở hữu và không có quyền
    await logAuthorizationFailure(
      user.id,
      `order:${orderId}`,
      PERMISSIONS.ORDER_READ,
      'Not owner and no permission'
    );
    redirect('/403');
  }

  // Kiểm tra quyền xem account secret
  const canReadSecret = user.permissions.includes(PERMISSIONS.ACCOUNT_READ_SECRET);

  return (
    <div className="container" style={{ paddingTop: '60px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/orders" style={{ color: '#0070f3' }}>
          ← Back to Orders
        </Link>
      </div>

      <div className="card">
        <h1 style={{ fontSize: '24px', marginBottom: '24px' }}>Order Details</h1>

        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
            <strong>Order ID:</strong> {order.id}
          </p>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
            <strong>Customer:</strong> {order.user.name} ({order.user.email})
          </p>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
            <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
          </p>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
            <strong>Status:</strong>{' '}
            <span
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 500,
                background:
                  order.status === 'COMPLETED'
                    ? '#e8f5e9'
                    : order.status === 'PAID'
                    ? '#e3f2fd'
                    : '#fff3e0',
                color:
                  order.status === 'COMPLETED'
                    ? '#2e7d32'
                    : order.status === 'PAID'
                    ? '#1976d2'
                    : '#f57c00',
              }}
            >
              {order.status}
            </span>
          </p>
          <p style={{ fontSize: '18px', fontWeight: 600, color: '#0070f3', marginTop: '12px' }}>
            Total: ${order.totalAmount.toFixed(2)}
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Order Items</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Account Info</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.product.name}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    {isOwner || canReadSecret ? (
                      item.accountSecret ? (
                        <code
                          style={{
                            padding: '4px 8px',
                            background: '#f0f0f0',
                            borderRadius: '4px',
                            fontSize: '12px',
                          }}
                        >
                          {item.accountSecret}
                        </code>
                      ) : (
                        <span style={{ color: '#666', fontSize: '12px' }}>
                          Not available yet
                        </span>
                      )
                    ) : (
                      <span style={{ color: '#e00', fontSize: '12px' }}>
                        [REDACTED - No Permission]
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!isOwner && !canReadSecret && (
          <div
            style={{
              marginTop: '24px',
              padding: '16px',
              background: '#fff3e0',
              borderRadius: '4px',
              fontSize: '14px',
              color: '#f57c00',
            }}
          >
            ⚠️ You don't have permission to view account credentials. Contact an
            administrator if you need access.
          </div>
        )}
      </div>
    </div>
  );
}
