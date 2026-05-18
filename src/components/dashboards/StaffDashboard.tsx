'use client';

import { motion } from 'framer-motion';
import { Package, ShoppingCart, Clock, AlertCircle, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatNumber } from '@/lib/utils';

interface StaffDashboardProps {
  stats: {
    totalProducts: number;
    totalOrders: number;
    pendingOrders: number;
  };
}

export function StaffDashboard({ stats }: StaffDashboardProps) {
  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
    },
    {
      title: 'Pending Orders',
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
          <h1 className="mb-2 text-4xl font-bold text-white">Staff Dashboard</h1>
          <p className="text-gray-400">Product & Order Management</p>
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
          <Card className="border-yellow-500/30 bg-yellow-500/5">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="mt-1 h-6 w-6 flex-shrink-0 text-yellow-500" />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-500">Limited Access</h3>
                  <p className="mt-1 text-sm text-gray-300">
                    Bạn có quyền quản lý sản phẩm và đơn hàng. Bạn không có quyền truy cập vào:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-gray-400">
                    <li>• Role Management (chỉ ADMIN)</li>
                    <li>• Permission Management (chỉ ADMIN)</li>
                    <li>• Security Configuration (chỉ ADMIN)</li>
                    <li>• User Role Assignment (chỉ ADMIN)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/products">
                  <div className="flex items-start space-x-3 rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/10">
                    <div className="rounded-lg bg-blue-500/10 p-2 text-blue-500">
                      <Package className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">View Products</h3>
                      <p className="mt-1 text-sm text-gray-400">Xem danh sách sản phẩm</p>
                    </div>
                  </div>
                </Link>
                
                <div className="flex items-start space-x-3 rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/10">
                  <div className="rounded-lg bg-green-500/10 p-2 text-green-500">
                    <Package className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">Manage Inventory</h3>
                    <p className="mt-1 text-sm text-gray-400">Quản lý tồn kho sản phẩm</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/orders">
                  <div className="flex items-start space-x-3 rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/10">
                    <div className="rounded-lg bg-purple-500/10 p-2 text-purple-500">
                      <ShoppingCart className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">View Orders</h3>
                      <p className="mt-1 text-sm text-gray-400">Xem tất cả đơn hàng</p>
                    </div>
                  </div>
                </Link>
                
                <div className="flex items-start space-x-3 rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/10">
                  <div className="rounded-lg bg-orange-500/10 p-2 text-orange-500">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">Pending Orders</h3>
                    <p className="mt-1 text-sm text-gray-400">
                      {stats.pendingOrders} đơn hàng đang chờ xử lý
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Restricted Access Demo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card className="border-red-500/30 bg-red-500/5">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-500">
                <Settings className="h-5 w-5" />
                <span>Restricted Areas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-gray-300">
                Các khu vực sau đây bị hạn chế truy cập đối với STAFF:
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 opacity-50">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-red-500" />
                    <h3 className="font-semibold text-red-500">Role Management</h3>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">
                    Required: <code className="font-mono">role:update</code>
                  </p>
                </div>
                
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 opacity-50">
                  <div className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-red-500" />
                    <h3 className="font-semibold text-red-500">Security Config</h3>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">
                    Required: <code className="font-mono">audit:read</code>
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
