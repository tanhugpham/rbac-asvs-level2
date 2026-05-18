/**
 * Orders Page
 * Authorization:
 * - ADMIN/STAFF: xem tất cả orders
 * - CUSTOMER: chỉ xem orders của chính mình
 */

import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';
import { PERMISSIONS } from '@/types/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function OrdersPage() {
  const user = await requireAuth();

  // Kiểm tra quyền
  const canReadAll =
    user.permissions.includes(PERMISSIONS.ORDER_READ) ||
    user.permissions.includes(PERMISSIONS.ORDER_MANAGE);

  // Query orders dựa trên quyền
  const orders = await prisma.order.findMany({
    where: canReadAll ? {} : { userId: user.id },
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
    orderBy: {
      createdAt: 'desc',
    },
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
          {canReadAll ? 'All Orders' : 'My Orders'}
        </h1>

        {orders.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
            No orders found
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  padding: '20px',
                  background: '#f9f9f9',
                  borderRadius: '8px',
                  border: '1px solid #eee',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                      Order ID: {order.id.slice(0, 8)}...
                    </p>
                    {canReadAll && (
                      <p style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                        Customer: {order.user.email}
                      </p>
                    )}
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      Date: {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '20px', fontWeight: 600, color: '#0070f3' }}>
                      ${order.totalAmount.toFixed(2)}
                    </p>
                    <span
                      style={{
                        display: 'inline-block',
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
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                    Items:
                  </h3>
                  {order.orderItems.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px',
                        background: 'white',
                        borderRadius: '4px',
                        marginBottom: '4px',
                        fontSize: '14px',
                      }}
                    >
                      <span>
                        {item.product.name} x {item.quantity}
                      </span>
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/orders/${order.id}`}
                  className="btn btn-secondary"
                  style={{ marginTop: '12px', fontSize: '14px', padding: '8px 16px' }}
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
