'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, CheckCircle, Clock, AlertCircle, Package, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatNumber, formatDate } from '@/lib/utils';

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: Date;
  orderItems: {
    id: string;
    quantity: number;
    product: {
      name: string;
      price: number;
    };
  }[];
}

interface CustomerDashboardProps {
  stats: {
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
  };
  orders: Order[];
}

export function CustomerDashboard({ stats, orders }: CustomerDashboardProps) {
  const statCards = [
    {
      title: 'My Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
    {
      title: 'Completed',
      value: stats.completedOrders,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
    },
    {
      title: 'Pending',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
    },
  ];
  
  return (
    <div className="min-h-screen bg-security-bg bg-cyber-grid p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="mb-2 text-4xl font-bold text-white">My Dashboard</h1>
          <p className="text-gray-400">View your orders and purchased accounts</p>
        </motion.div>
        
        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card glow className={`border ${stat.borderColor}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">{stat.title}</p>
                      <p className="mt-2 text-3xl font-bold text-white">
                        {formatNumber(stat.value)}
                      </p>
                    </div>
                    <div className={`rounded-full ${stat.bgColor} p-4`}>
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Limited Access Notice */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="mt-1 h-6 w-6 flex-shrink-0 text-blue-500" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-500">Customer Access</h3>
                  <p className="mt-1 text-sm text-gray-300">
                    Bạn chỉ có thể xem dữ liệu thuộc sở hữu của mình. Bạn không có quyền truy cập vào:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-gray-400">
                    <li>• Admin Dashboard (chỉ ADMIN)</li>
                    <li>• User Management (chỉ ADMIN/STAFF)</li>
                    <li>• Product Management (chỉ ADMIN/STAFF)</li>
                    <li>• Other Users' Orders (chỉ xem đơn hàng của bạn)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="py-8 text-center">
                    <Package className="mx-auto mb-3 h-12 w-12 text-gray-600" />
                    <p className="text-sm text-gray-500">No orders yet</p>
                    <Link
                      href="/products"
                      className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <Link key={order.id} href={`/orders/${order.id}`}>
                        <div className="rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/10">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <ShoppingCart className="h-4 w-4 text-gray-400" />
                                <span className="font-mono text-sm text-gray-400">
                                  #{order.id.slice(0, 8)}
                                </span>
                              </div>
                              <p className="mt-2 text-sm text-white">
                                {order.orderItems.length} item(s)
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-white">
                                {order.totalAmount.toLocaleString('vi-VN')} đ
                              </p>
                              <span
                                className={`mt-1 inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                                  order.status === 'COMPLETED'
                                    ? 'bg-green-500/20 text-green-500'
                                    : order.status === 'PENDING'
                                    ? 'bg-orange-500/20 text-orange-500'
                                    : 'bg-gray-500/20 text-gray-500'
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                    {orders.length >= 5 && (
                      <Link
                        href="/orders"
                        className="block text-center text-sm font-semibold text-blue-400 transition-colors hover:text-blue-300"
                      >
                        View All Orders →
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/products">
                  <div className="flex items-start space-x-3 rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/10">
                    <div className="rounded-lg bg-blue-500/10 p-2 text-blue-500">
                      <Package className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">Browse Products</h3>
                      <p className="mt-1 text-sm text-gray-400">Xem danh sách sản phẩm</p>
                    </div>
                  </div>
                </Link>
                
                <Link href="/orders">
                  <div className="flex items-start space-x-3 rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/10">
                    <div className="rounded-lg bg-purple-500/10 p-2 text-purple-500">
                      <ShoppingCart className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">My Orders</h3>
                      <p className="mt-1 text-sm text-gray-400">Xem đơn hàng của bạn</p>
                    </div>
                  </div>
                </Link>
                
                <div className="flex items-start space-x-3 rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/10">
                  <div className="rounded-lg bg-green-500/10 p-2 text-green-500">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">Support Chat</h3>
                    <p className="mt-1 text-sm text-gray-400">Liên hệ hỗ trợ</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Security Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-sm font-semibold text-white">Secure Access</p>
                  <p className="text-xs text-gray-400">
                    Dữ liệu của bạn được bảo vệ bởi RBAC system - chỉ bạn mới có thể xem đơn hàng của mình
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
