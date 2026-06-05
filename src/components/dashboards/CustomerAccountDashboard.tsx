'use client';

import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  CreditCard, 
  Shield, 
  MessageCircle, 
  User, 
  Package,
  AlertCircle,
  Lock,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LogoutButton } from '@/components/LogoutButton';
import { formatNumber } from '@/lib/utils';

interface CustomerAccountDashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    roles: string[];
  };
  stats: {
    totalOrders: number;
    purchasedAccounts: number;
    walletBalance: number;
  };
}

export function CustomerAccountDashboard({ user, stats }: CustomerAccountDashboardProps) {
  const statCards = [
    {
      title: 'My Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      href: '/account/orders',
    },
    {
      title: 'Purchased Accounts',
      value: stats.purchasedAccounts,
      icon: Package,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      href: '/account/orders',
    },
    {
      title: 'Wallet Balance',
      value: `$${formatNumber(stats.walletBalance)}`,
      icon: CreditCard,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      href: '/account/wallet',
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-white">
                Xin chào, {user.name}
              </h1>
              <p className="text-gray-400">Customer Account Dashboard</p>
            </div>
            <LogoutButton variant="default" />
          </div>
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
              <Link href={stat.href}>
                <Card glow className={`border ${stat.borderColor} transition-all hover:scale-105`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">{stat.title}</p>
                        <p className="mt-2 text-3xl font-bold text-white">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`rounded-full ${stat.bgColor} p-4`}>
                        <stat.icon className={`h-8 w-8 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Access Notice */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <Shield className="mt-1 h-6 w-6 flex-shrink-0 text-blue-400" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-400">Your Access Level</h3>
                  <p className="mt-1 text-sm text-gray-300">
                    Bạn có quyền truy cập:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-gray-400">
                    <li className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-green-500" />
                      Xem đơn hàng của chính mình
                    </li>
                    <li className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-green-500" />
                      Xem tài khoản đã mua
                    </li>
                    <li className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-green-500" />
                      Quản lý profile cá nhân
                    </li>
                    <li className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-red-500" />
                      Không thể xem dữ liệu của user khác
                    </li>
                    <li className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-red-500" />
                      Không thể truy cập admin/staff features
                    </li>
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
                <CardTitle>My Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <QuickActionCard
                  title="My Orders"
                  description="Xem lịch sử đơn hàng của bạn"
                  icon={ShoppingBag}
                  href="/account/orders"
                  color="blue"
                />
                <QuickActionCard
                  title="Mua thêm tài khoản"
                  description="Xem sản phẩm và mua tài khoản mới"
                  icon={ShoppingBag}
                  href="/products"
                  color="purple"
                />
                <QuickActionCard
                  title="Profile Settings"
                  description="Cập nhật thông tin cá nhân"
                  icon={User}
                  href="/account/profile"
                  color="purple"
                />
                <QuickActionCard
                  title="Security"
                  description="Đổi mật khẩu và bảo mật tài khoản"
                  icon={Shield}
                  href="/account/security"
                  color="green"
                />
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
                <CardTitle>Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <QuickActionCard
                  title="Contact Support"
                  description="Liên hệ với đội ngũ hỗ trợ"
                  icon={MessageCircle}
                  href="/account/support"
                  color="orange"
                />
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="mt-1 h-5 w-5 flex-shrink-0 text-yellow-500" />
                    <div>
                      <p className="text-sm font-semibold text-white">Need Help?</p>
                      <p className="mt-1 text-xs text-gray-400">
                        Nếu bạn gặp vấn đề với đơn hàng hoặc tài khoản, vui lòng liên hệ support.
                      </p>
                    </div>
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
          className="mt-6"
        >
          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-sm font-semibold text-white">OWASP ASVS Level 2 Protected</p>
                    <p className="text-xs text-gray-400">
                      Bạn chỉ có thể xem và quản lý tài nguyên thuộc sở hữu của mình.
                      Mọi truy cập trái phép đều bị chặn và ghi log.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: 'blue' | 'purple' | 'green' | 'orange';
}

function QuickActionCard({ title, description, icon: Icon, href, color }: QuickActionCardProps) {
  const colorClasses = {
    blue: 'text-blue-500 bg-blue-500/10',
    purple: 'text-purple-500 bg-purple-500/10',
    green: 'text-green-500 bg-green-500/10',
    orange: 'text-orange-500 bg-orange-500/10',
  };

  return (
    <Link href={href}>
      <div className="flex items-start space-x-3 rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/10">
        <div className={`rounded-lg p-2 ${colorClasses[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm text-gray-400">{description}</p>
        </div>
      </div>
    </Link>
  );
}
