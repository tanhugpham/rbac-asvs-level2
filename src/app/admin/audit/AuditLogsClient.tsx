'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Search,
  Filter,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  LogIn,
  LogOut,
  Lock,
  Zap,
  User,
  Globe,
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LogoutButton } from '@/components/LogoutButton';
import { getDashboardPath, ROLES } from '@/lib/dashboard-routes';

interface AuditLog {
  id: string;
  createdAt: string; // Already formatted on server
  userId: string | null;
  userName: string;
  userEmail: string;
  action: string;
  resource: string;
  permission: string;
  status: string;
  ipAddress: string;
  details: string | null;
}

interface AuditLogsClientProps {
  logs: AuditLog[];
}

export function AuditLogsClient({ logs }: AuditLogsClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');

  // Get unique actions for filter
  const uniqueActions = useMemo(() => {
    const actions = new Set(logs.map((log) => log.action));
    return Array.from(actions).sort();
  }, [logs]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        log.userEmail.toLowerCase().includes(searchLower) ||
        log.userName.toLowerCase().includes(searchLower) ||
        log.action.toLowerCase().includes(searchLower) ||
        log.resource.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;

      // Action filter
      const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;

      return matchesSearch && matchesStatus && matchesAction;
    });
  }, [logs, searchQuery, statusFilter, actionFilter]);

  // Get action icon
  const getActionIcon = (action: string) => {
    if (action.includes('LOGIN')) return LogIn;
    if (action.includes('LOGOUT')) return LogOut;
    if (action.includes('DENIED') || action.includes('ACCESS_DENIED')) return Lock;
    if (action.includes('ATTACK')) return Zap;
    return FileText;
  };

  // Get action color
  const getActionColor = (action: string) => {
    if (action.includes('LOGIN')) return 'text-blue-500 bg-blue-500/10';
    if (action.includes('LOGOUT')) return 'text-purple-500 bg-purple-500/10';
    if (action.includes('DENIED') || action.includes('ACCESS_DENIED'))
      return 'text-red-500 bg-red-500/10';
    if (action.includes('ATTACK')) return 'text-orange-500 bg-orange-500/10';
    return 'text-gray-500 bg-gray-500/10';
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const configs = {
      SUCCESS: {
        icon: CheckCircle,
        color: 'text-green-500 bg-green-500/10 border-green-500/30',
      },
      DENIED: {
        icon: XCircle,
        color: 'text-red-500 bg-red-500/10 border-red-500/30',
      },
      WARNING: {
        icon: AlertTriangle,
        color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
      },
      ERROR: {
        icon: XCircle,
        color: 'text-orange-500 bg-orange-500/10 border-orange-500/30',
      },
    };

    const config = configs[status as keyof typeof configs] || {
      icon: FileText,
      color: 'text-gray-500 bg-gray-500/10 border-gray-500/30',
    };

    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${config.color}`}
      >
        <Icon className="h-3 w-3" />
        {status}
      </span>
    );
  };

  // Stats
  const stats = useMemo(() => {
    const total = logs.length;
    const success = logs.filter((l) => l.status === 'SUCCESS').length;
    const denied = logs.filter((l) => l.status === 'DENIED').length;
    const attacks = logs.filter((l) => l.action.includes('ATTACK')).length;

    return { total, success, denied, attacks };
  }, [logs]);

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
              <Link
                href={getDashboardPath(ROLES.ADMIN)}
                className="mb-4 inline-flex items-center text-sm text-gray-400 transition-colors hover:text-white"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-4xl font-bold text-white">Audit Logs</h1>
              <p className="text-gray-400">
                Theo dõi đăng nhập, truy cập bị từ chối và hành vi nhạy cảm
              </p>
            </div>
            <LogoutButton variant="default" />
          </div>
        </motion.div>

        {/* Security Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Shield className="h-6 w-6 flex-shrink-0 text-blue-400" />
                <div>
                  <h3 className="font-semibold text-blue-400">OWASP ASVS Level 2 Compliance</h3>
                  <p className="mt-1 text-sm text-gray-300">
                    Audit log giúp ghi nhận các hành vi đăng nhập, đăng xuất, truy cập trái phép và
                    thao tác nhạy cảm. Đây là một phần quan trọng trong kiểm thử phân quyền RBAC và
                    OWASP ASVS Level 2. Mọi access attempt đều được log với timestamp, user, action,
                    và result.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 grid gap-4 md:grid-cols-4"
        >
          <Card className="border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Logs</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Success</p>
                  <p className="text-2xl font-bold text-white">{stats.success}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Denied</p>
                  <p className="text-2xl font-bold text-white">{stats.denied}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Attacks</p>
                  <p className="text-2xl font-bold text-white">{stats.attacks}</p>
                </div>
                <Zap className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by email, action, or resource..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-lg border border-white/10 bg-[#111827] px-3 py-2 text-white focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer hover:bg-[#1f2937]"
                  >
                    <option value="ALL" className="bg-[#111827] text-white">All Status</option>
                    <option value="SUCCESS" className="bg-[#111827] text-white">Success</option>
                    <option value="DENIED" className="bg-[#111827] text-white">Denied</option>
                    <option value="WARNING" className="bg-[#111827] text-white">Warning</option>
                    <option value="ERROR" className="bg-[#111827] text-white">Error</option>
                  </select>
                </div>

                {/* Action Filter */}
                <div>
                  <select
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                    className="rounded-lg border border-white/10 bg-[#111827] px-3 py-2 text-white focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer hover:bg-[#1f2937]"
                  >
                    <option value="ALL" className="bg-[#111827] text-white">All Actions</option>
                    {uniqueActions.map((action) => (
                      <option key={action} value={action} className="bg-[#111827] text-white">
                        {action}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Results count */}
              <div className="mt-3 text-sm text-gray-400">
                Showing {filteredLogs.length} of {logs.length} logs
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Logs Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-500" />
                <span>Audit Log Entries</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Shield className="h-16 w-16 text-gray-600" />
                  <h3 className="mt-4 text-lg font-semibold text-white">
                    {logs.length === 0 ? 'Chưa có audit logs' : 'No logs match your filters'}
                  </h3>
                  <p className="mt-2 text-sm text-gray-400">
                    {logs.length === 0
                      ? 'Audit logs sẽ xuất hiện khi có hoạt động trong hệ thống'
                      : 'Try adjusting your search or filters'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                          Time
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                          User
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                          Action
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                          Resource
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                          Permission
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                          IP Address
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLogs.map((log, index) => {
                        const ActionIcon = getActionIcon(log.action);
                        const actionColor = getActionColor(log.action);

                        return (
                          <motion.tr
                            key={log.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.02 }}
                            className="border-b border-white/5 transition-colors hover:bg-white/5"
                          >
                            <td className="px-4 py-3 text-sm text-gray-300">
                              {log.createdAt}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-400" />
                                <div>
                                  <p className="text-sm font-medium text-white">
                                    {log.userName}
                                  </p>
                                  <p className="text-xs text-gray-400">{log.userEmail}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${actionColor}`}
                              >
                                <ActionIcon className="h-3 w-3" />
                                {log.action}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-300">{log.resource}</td>
                            <td className="px-4 py-3">
                              <code className="text-xs text-cyan-400">{log.permission}</code>
                            </td>
                            <td className="px-4 py-3">{getStatusBadge(log.status)}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1 text-sm text-gray-300">
                                <Globe className="h-3 w-3 text-gray-400" />
                                {log.ipAddress}
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
