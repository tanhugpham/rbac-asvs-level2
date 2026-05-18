'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Crown,
  Briefcase,
  User,
  Users,
  CheckCircle,
  Save,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LogoutButton } from '@/components/LogoutButton';
import { getDashboardPath } from '@/lib/dashboard-routes';
import type { SessionUser } from '@/types/auth';

interface Permission {
  id: string;
  name: string;
  description: string | null;
}

interface Role {
  id: string;
  name: string;
  description: string | null;
  rolePermissions: Array<{
    id: string;
    permission: Permission;
  }>;
  _count: {
    userRoles: number;
  };
}

interface RolesPageClientProps {
  roles: Role[];
  allPermissions: Permission[];
  canUpdateRoles: boolean;
  currentUser: SessionUser;
}

export function RolesPageClient({
  roles,
  allPermissions,
  canUpdateRoles,
  currentUser,
}: RolesPageClientProps) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSelectRole = (role: Role) => {
    setSelectedRole(role);
    setSelectedPermissions(role.rolePermissions.map((rp) => rp.permission.id));
    setMessage(null);
  };

  const handleTogglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSave = async () => {
    if (!selectedRole) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/roles/${selectedRole.id}/permissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissionIds: selectedPermissions }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Permissions updated successfully' });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setMessage({ type: 'error', text: data.error?.message || 'Failed to update permissions' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const hasChanges =
    selectedRole &&
    JSON.stringify([...selectedPermissions].sort()) !==
      JSON.stringify(selectedRole.rolePermissions.map((rp) => rp.permission.id).sort());

  const getRoleConfig = (roleName: string) => {
    const configs = {
      ADMIN: {
        color: 'from-red-500 to-red-600',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
        textColor: 'text-red-500',
        icon: Crown,
      },
      STAFF: {
        color: 'from-purple-500 to-purple-600',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/30',
        textColor: 'text-purple-500',
        icon: Briefcase,
      },
      CUSTOMER: {
        color: 'from-green-500 to-green-600',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30',
        textColor: 'text-green-500',
        icon: User,
      },
    };

    return (
      configs[roleName as keyof typeof configs] || {
        color: 'from-gray-500 to-gray-600',
        bgColor: 'bg-gray-500/10',
        borderColor: 'border-gray-500/30',
        textColor: 'text-gray-500',
        icon: Shield,
      }
    );
  };

  // Group permissions by category
  const permissionGroups = {
    'User Permissions': allPermissions.filter((p) => p.name.startsWith('user:')),
    'Role Permissions': allPermissions.filter((p) => p.name.startsWith('role:')),
    'Product Permissions': allPermissions.filter((p) => p.name.startsWith('product:')),
    'Order Permissions': allPermissions.filter((p) => p.name.startsWith('order:')),
    'Security Permissions': allPermissions.filter(
      (p) => p.name.startsWith('account:') || p.name.startsWith('audit:')
    ),
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
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">Role Management</h1>
                  <p className="text-gray-400">Manage roles and permissions</p>
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

        {/* Roles Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Role Cards */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Roles</h2>
            {roles.map((role, index) => {
              const config = getRoleConfig(role.name);
              const Icon = config.icon;
              const isSelected = selectedRole?.id === role.id;

              return (
                <motion.button
                  key={role.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  onClick={() => handleSelectRole(role)}
                  className={`w-full rounded-xl border p-6 text-left transition-all ${
                    isSelected
                      ? `${config.borderColor} ${config.bgColor} shadow-lg`
                      : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${config.color}`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold ${config.textColor}`}>{role.name}</h3>
                      <p className="mt-1 text-sm text-gray-400">{role.description}</p>
                      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{role._count.userRoles} users</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          <span>{role.rolePermissions.length} permissions</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Permissions Panel */}
          <div className="lg:col-span-2">
            {selectedRole ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-6 w-6 text-purple-500" />
                      <span>Permissions for {selectedRole.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {Object.entries(permissionGroups).map(([groupName, permissions]) => {
                        if (permissions.length === 0) return null;

                        return (
                          <div key={groupName}>
                            <h3 className="mb-3 text-sm font-semibold text-gray-400">
                              {groupName}
                            </h3>
                            <div className="grid gap-2 md:grid-cols-2">
                              {permissions.map((permission) => {
                                const isChecked = selectedPermissions.includes(permission.id);

                                return (
                                  <label
                                    key={permission.id}
                                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-all ${
                                      isChecked
                                        ? 'border-purple-500/50 bg-purple-500/10'
                                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                                    } ${!canUpdateRoles ? 'cursor-not-allowed opacity-50' : ''}`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => handleTogglePermission(permission.id)}
                                      disabled={!canUpdateRoles}
                                      className="mt-0.5 h-4 w-4 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-2 focus:ring-purple-500/50"
                                    />
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-white">
                                        {permission.name}
                                      </p>
                                      {permission.description && (
                                        <p className="mt-0.5 text-xs text-gray-400">
                                          {permission.description}
                                        </p>
                                      )}
                                    </div>
                                    {isChecked && (
                                      <CheckCircle className="h-4 w-4 flex-shrink-0 text-purple-500" />
                                    )}
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Message */}
                    {message && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-4 flex items-start gap-2 rounded-lg border p-4 ${
                          message.type === 'success'
                            ? 'border-green-500/30 bg-green-500/10 text-green-400'
                            : 'border-red-500/30 bg-red-500/10 text-red-400'
                        }`}
                      >
                        {message.type === 'success' ? (
                          <CheckCircle className="h-5 w-5 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        )}
                        <p className="text-sm">{message.text}</p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card>
                <CardContent className="flex h-[600px] items-center justify-center">
                  <div className="text-center">
                    <Shield className="mx-auto h-16 w-16 text-gray-600" />
                    <h3 className="mt-4 text-lg font-semibold text-white">
                      Select a role to manage permissions
                    </h3>
                    <p className="mt-2 text-sm text-gray-400">
                      Click on a role card to view and edit its permissions
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Save Button */}
      {hasChanges && canUpdateRoles && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
        >
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 font-semibold text-white shadow-2xl transition-all hover:from-purple-700 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-5 w-5" />
            {loading ? 'Saving...' : 'Save Permission Changes'}
          </button>
        </motion.div>
      )}
    </div>
  );
}
