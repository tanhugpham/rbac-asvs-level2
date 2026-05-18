'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Shield,
  Search,
  Filter,
  UserCog,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Crown,
  Briefcase,
  User as UserIcon,
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LogoutButton } from '@/components/LogoutButton';
import { getDashboardPath } from '@/lib/dashboard-routes';
import { UserRoleManagerModal } from '@/components/UserRoleManagerModal';
import { formatDate } from '@/lib/utils';
import type { SessionUser } from '@/types/auth';

interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  userRoles: Array<{
    id: string;
    role: {
      id: string;
      name: string;
    };
  }>;
}

interface Role {
  id: string;
  name: string;
}

interface UsersPageClientProps {
  users: User[];
  roles: Role[];
  canUpdateRoles: boolean;
  currentUser: SessionUser;
}

export function UsersPageClient({
  users,
  roles,
  canUpdateRoles,
  currentUser,
}: UsersPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !searchQuery ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      roleFilter === 'ALL' ||
      user.userRoles.some((ur) => ur.role.name === roleFilter);

    return matchesSearch && matchesRole;
  });

  // Get role badge config
  const getRoleBadge = (roleName: string) => {
    const configs = {
      ADMIN: {
        color: 'bg-red-500/10 text-red-500 border-red-500/30',
        icon: Crown,
      },
      STAFF: {
        color: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
        icon: Briefcase,
      },
      CUSTOMER: {
        color: 'bg-green-500/10 text-green-500 border-green-500/30',
        icon: UserIcon,
      },
    };

    return (
      configs[roleName as keyof typeof configs] || {
        color: 'bg-gray-500/10 text-gray-500 border-gray-500/30',
        icon: UserIcon,
      }
    );
  };

  // Get initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get avatar color
  const getAvatarColor = (roles: User['userRoles']) => {
    if (roles.some((r) => r.role.name === 'ADMIN')) {
      return 'from-red-500 to-red-600';
    }
    if (roles.some((r) => r.role.name === 'STAFF')) {
      return 'from-purple-500 to-purple-600';
    }
    return 'from-green-500 to-green-600';
  };

  // Stats
  const stats = {
    total: users.length,
    active: users.filter((u) => u.isActive).length,
    admins: users.filter((u) => u.userRoles.some((r) => r.role.name === 'ADMIN')).length,
    staff: users.filter((u) => u.userRoles.some((r) => r.role.name === 'STAFF')).length,
    customers: users.filter((u) => u.userRoles.some((r) => r.role.name === 'CUSTOMER')).length,
  };

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
                href={getDashboardPath(currentUser.roles[0] as any)}
                className="mb-4 inline-flex items-center text-sm text-gray-400 transition-colors hover:text-white"
              >
                ← Back to Dashboard
              </Link>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/50">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">User Management</h1>
                  <p className="text-gray-400">Manage users, roles, and permissions</p>
                </div>
              </div>
            </div>
            <LogoutButton variant="default" />
          </div>
        </motion.div>

        {/* Security Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 flex-shrink-0 text-blue-400" />
                <div className="text-sm text-gray-300">
                  <p className="font-semibold text-blue-400">OWASP ASVS Level 2 Compliance</p>
                  <p className="mt-1">
                    Role and permission changes are audited and protected by OWASP ASVS Level 2
                    authorization controls. All modifications are logged for security review.
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
          className="mb-6 grid gap-4 md:grid-cols-5"
        >
          <Card className="border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active</p>
                  <p className="text-2xl font-bold text-white">{stats.active}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Admins</p>
                  <p className="text-2xl font-bold text-white">{stats.admins}</p>
                </div>
                <Crown className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Staff</p>
                  <p className="text-2xl font-bold text-white">{stats.staff}</p>
                </div>
                <Briefcase className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Customers</p>
                  <p className="text-2xl font-bold text-white">{stats.customers}</p>
                </div>
                <UserIcon className="h-8 w-8 text-green-500" />
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
                      placeholder="Search by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                {/* Role Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="rounded-lg border border-white/10 bg-[#111827] px-3 py-2 text-white transition-all hover:bg-[#1f2937] focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="ALL" className="bg-[#111827] text-white">
                      All Roles
                    </option>
                    <option value="ADMIN" className="bg-[#111827] text-white">
                      Admin
                    </option>
                    <option value="STAFF" className="bg-[#111827] text-white">
                      Staff
                    </option>
                    <option value="CUSTOMER" className="bg-[#111827] text-white">
                      Customer
                    </option>
                  </select>
                </div>
              </div>

              {/* Results count */}
              <div className="mt-3 text-sm text-gray-400">
                Showing {filteredUsers.length} of {users.length} users
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-500" />
                <span>User List</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="h-16 w-16 text-gray-600" />
                  <h3 className="mt-4 text-lg font-semibold text-white">No users found</h3>
                  <p className="mt-2 text-sm text-gray-400">
                    {searchQuery || roleFilter !== 'ALL'
                      ? 'Try adjusting your search or filters'
                      : 'No users in the system'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-[#111827]">
                      <tr className="border-b border-white/10">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                          User
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                          Roles
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                          Created
                        </th>
                        {canUpdateRoles && (
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user, index) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.02 }}
                          className="border-b border-white/5 transition-colors hover:bg-white/5"
                        >
                          {/* User */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${getAvatarColor(
                                  user.userRoles
                                )} text-sm font-bold text-white`}
                              >
                                {getInitials(user.name)}
                              </div>
                              <div>
                                <p className="font-medium text-white">{user.name}</p>
                                <p className="text-sm text-gray-400">{user.email}</p>
                              </div>
                            </div>
                          </td>

                          {/* Roles */}
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-2">
                              {user.userRoles.map((ur) => {
                                const badge = getRoleBadge(ur.role.name);
                                const Icon = badge.icon;
                                return (
                                  <span
                                    key={ur.id}
                                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${badge.color}`}
                                  >
                                    <Icon className="h-3 w-3" />
                                    {ur.role.name}
                                  </span>
                                );
                              })}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3">
                            {user.isActive ? (
                              <span className="inline-flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-xs font-semibold text-green-500">
                                <CheckCircle className="h-3 w-3" />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-500">
                                <XCircle className="h-3 w-3" />
                                Inactive
                              </span>
                            )}
                          </td>

                          {/* Created */}
                          <td className="px-4 py-3 text-sm text-gray-300">
                            {formatDate(user.createdAt)}
                          </td>

                          {/* Actions */}
                          {canUpdateRoles && (
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setSelectedUser(user)}
                                  className="flex items-center gap-1 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-400 transition-all hover:bg-blue-500/20"
                                >
                                  <UserCog className="h-3 w-3" />
                                  Manage Roles
                                </button>
                              </div>
                            </td>
                          )}
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* User Role Manager Modal */}
      {selectedUser && (
        <UserRoleManagerModal
          user={selectedUser}
          roles={roles}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
