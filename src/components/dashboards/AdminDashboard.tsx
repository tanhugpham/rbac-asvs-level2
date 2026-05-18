'use client';

import { motion } from 'framer-motion';
import { Users, Shield, Key, AlertTriangle, Activity, Eye, Settings, FileText } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatNumber, formatDate } from '@/lib/utils';

interface AuditLog {
  id: string;
  userId: string | null;
  action: string;
  resource: string;
  createdAt: Date;
  user: {
    name: string;
    email: string;
  } | null;
}

interface AdminDashboardProps {
  stats: {
    totalUsers: number;
    totalRoles: number;
    totalPermissions: number;
    deniedAttempts: number;
  };
  recentLogs: AuditLog[];
}

export function AdminDashboard({ stats, recentLogs }: AdminDashboardProps) {
  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
    {
      title: 'Total Roles',
      value: stats.totalRoles,
      icon: Shield,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
    },
    {
      title: 'Total Permissions',
      value: stats.totalPermissions,
      icon: Key,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
    },
    {
      title: 'Access Denied',
      value: stats.deniedAttempts,
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
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
          <h1 className="mb-2 text-4xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400">Security Operations Center - OWASP ASVS Level 2</p>
        </motion.div>
        
        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
        
        {/* Security Alert */}
        {stats.deniedAttempts > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <Card className="border-red-500/30 bg-red-500/5">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="mt-1 h-6 w-6 flex-shrink-0 text-red-500" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-500">Security Alert</h3>
                    <p className="mt-1 text-sm text-gray-300">
                      Có <strong>{stats.deniedAttempts}</strong> lần truy cập trái phép được ghi nhận. 
                      Vui lòng kiểm tra audit logs để xem chi tiết.
                    </p>
                    <Link 
                      href="/admin/audit"
                      className="mt-3 inline-block text-sm font-semibold text-red-400 transition-colors hover:text-red-300"
                    >
                      Xem Audit Logs →
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
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
              <CardContent className="grid gap-4">
                <QuickActionCard
                  title="RBAC Matrix"
                  description="Xem ma trận quyền hạn và phân quyền"
                  icon={Shield}
                  href="/admin/security"
                  color="blue"
                />
                <QuickActionCard
                  title="Audit Logs"
                  description="Xem nhật ký bảo mật và truy cập"
                  icon={Activity}
                  href="/admin/audit"
                  color="purple"
                />
                <QuickActionCard
                  title="User Management"
                  description="Quản lý người dùng và vai trò"
                  icon={Users}
                  href="/admin/users"
                  color="green"
                />
                <QuickActionCard
                  title="Role Management"
                  description="Quản lý vai trò và quyền hạn"
                  icon={Settings}
                  href="/admin/roles"
                  color="orange"
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentLogs.length === 0 ? (
                    <p className="text-center text-sm text-gray-500">No recent activity</p>
                  ) : (
                    recentLogs.slice(0, 5).map((log) => (
                      <div
                        key={log.id}
                        className="flex items-start space-x-3 rounded-lg border border-white/5 bg-white/5 p-3 transition-colors hover:bg-white/10"
                      >
                        <div className={`mt-1 rounded-full p-1 ${
                          log.action.includes('DENIED') 
                            ? 'bg-red-500/20 text-red-500' 
                            : 'bg-green-500/20 text-green-500'
                        }`}>
                          {log.action.includes('DENIED') ? (
                            <AlertTriangle className="h-4 w-4" />
                          ) : (
                            <Activity className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {log.user?.name || 'Unknown User'}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {log.action} - {log.resource}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(log.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {recentLogs.length > 5 && (
                  <Link
                    href="/admin/audit"
                    className="mt-4 block text-center text-sm font-semibold text-blue-400 transition-colors hover:text-blue-300"
                  >
                    View All Logs →
                  </Link>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* System Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6"
        >
          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-sm font-semibold text-white">OWASP ASVS Level 2 Compliant</p>
                    <p className="text-xs text-gray-400">
                      All authorization checks are performed server-side with comprehensive audit logging
                    </p>
                  </div>
                </div>
                <Link
                  href="/admin/security"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  View Details
                </Link>
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
