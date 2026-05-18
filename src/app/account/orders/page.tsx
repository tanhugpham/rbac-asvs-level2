import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ShoppingBag, Package } from 'lucide-react';
import Link from 'next/link';
import { LogoutButton } from '@/components/LogoutButton';

export default async function CustomerOrdersPage() {
  try {
    console.log('[CUSTOMER ORDERS] Loading...');
    
    const user = await getCurrentUser();

    if (!user) {
      redirect('/login');
    }

    console.log('[CUSTOMER ORDERS] User:', user.email);

    // Fetch user's orders with error handling
    let orders: any[] = [];

    try {
      orders = await prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }).catch(() => []);

      console.log('[CUSTOMER ORDERS] Orders loaded:', orders.length);
    } catch (error) {
      console.error('[CUSTOMER ORDERS] Error loading orders:', error);
      // Continue with empty array
    }

    return (
      <div className="min-h-screen bg-security-bg bg-cyber-grid p-6">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Link 
                href="/account"
                className="mb-4 inline-flex items-center text-sm text-gray-400 transition-colors hover:text-white"
              >
                ← Back to Account
              </Link>
              <h1 className="text-4xl font-bold text-white">My Orders</h1>
              <p className="text-gray-400">Lịch sử đơn hàng của bạn</p>
            </div>
            <LogoutButton variant="default" />
          </div>

          {/* Orders List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-6 w-6 text-blue-500" />
                <span>Order History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Package className="h-16 w-16 text-gray-600" />
                  <h3 className="mt-4 text-lg font-semibold text-white">No Orders Yet</h3>
                  <p className="mt-2 text-sm text-gray-400">
                    Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!
                  </p>
                  <Link
                    href="/products"
                    className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4"
                    >
                      <div>
                        <p className="font-semibold text-white">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">${order.totalAmount || 0}</p>
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                            order.status === 'COMPLETED'
                              ? 'bg-green-500/20 text-green-500'
                              : order.status === 'PENDING'
                              ? 'bg-yellow-500/20 text-yellow-500'
                              : 'bg-gray-500/20 text-gray-500'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch (error: any) {
    console.error('[CUSTOMER ORDERS] Error:', error);

    if (error.message?.includes('Authentication required')) {
      redirect('/login');
    }

    throw error;
  }
}
