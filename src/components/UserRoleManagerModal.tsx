'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Briefcase, User, Trash2, Plus, CheckCircle, AlertCircle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
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

interface UserRoleManagerModalProps {
  user: User;
  roles: Role[];
  onClose: () => void;
}

export function UserRoleManagerModal({ user, roles, onClose }: UserRoleManagerModalProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAssignRole = async (roleId: string) => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/users/${user.id}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId, action: 'assign' }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Role assigned successfully' });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setMessage({ type: 'error', text: data.error?.message || 'Failed to assign role' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    if (!confirm('Are you sure you want to remove this role?')) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/users/${user.id}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId, action: 'remove' }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Role removed successfully' });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setMessage({ type: 'error', text: data.error?.message || 'Failed to remove role' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const currentRoleIds = user.userRoles.map((r) => r.role.id);
  const availableToAssign = roles.filter((r) => !currentRoleIds.includes(r.id));

  const getRoleConfig = (roleName: string) => {
    const configs = {
      ADMIN: {
        color: 'from-red-600 to-red-700',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
        textColor: 'text-red-500',
        icon: Crown,
      },
      STAFF: {
        color: 'from-purple-600 to-purple-700',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/30',
        textColor: 'text-purple-500',
        icon: Briefcase,
      },
      CUSTOMER: {
        color: 'from-green-600 to-green-700',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30',
        textColor: 'text-green-500',
        icon: User,
      },
    };

    return (
      configs[roleName as keyof typeof configs] || {
        color: 'from-gray-600 to-gray-700',
        bgColor: 'bg-gray-500/10',
        borderColor: 'border-gray-500/30',
        textColor: 'text-gray-500',
        icon: User,
      }
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl rounded-2xl border border-gray-700 bg-[#111827] shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b border-gray-700 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Manage User Roles</h2>
                <p className="mt-1 text-sm text-gray-400">
                  {user.name} ({user.email})
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[60vh] overflow-y-auto p-6">
            {/* Current Roles */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-semibold text-gray-400">Current Roles</h3>
              {user.userRoles.length === 0 ? (
                <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4 text-center">
                  <p className="text-sm text-gray-400">No roles assigned</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {user.userRoles.map((ur) => {
                    const config = getRoleConfig(ur.role.name);
                    const Icon = config.icon;
                    return (
                      <motion.div
                        key={ur.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex items-center justify-between rounded-lg border ${config.borderColor} ${config.bgColor} p-4`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${config.color}`}
                          >
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className={`font-semibold ${config.textColor}`}>{ur.role.name}</p>
                            <p className="text-xs text-gray-400">
                              {ur.role.name === 'ADMIN'
                                ? 'Full system access'
                                : ur.role.name === 'STAFF'
                                ? 'Product & order management'
                                : 'Own resources only'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveRole(ur.role.id)}
                          disabled={loading}
                          className="flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 className="h-3 w-3" />
                          Remove
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Assign New Role */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-400">Assign New Role</h3>
              {availableToAssign.length === 0 ? (
                <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4 text-center">
                  <p className="text-sm text-gray-400">All roles already assigned</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {availableToAssign.map((role) => {
                    const config = getRoleConfig(role.name);
                    const Icon = config.icon;
                    return (
                      <motion.button
                        key={role.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => handleAssignRole(role.id)}
                        disabled={loading}
                        className={`flex w-full items-center justify-between rounded-lg border ${config.borderColor} ${config.bgColor} p-4 transition-all hover:bg-opacity-20 disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${config.color}`}
                          >
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="text-left">
                            <p className={`font-semibold ${config.textColor}`}>{role.name}</p>
                            <p className="text-xs text-gray-400">
                              {role.name === 'ADMIN'
                                ? 'Full system access'
                                : role.name === 'STAFF'
                                ? 'Product & order management'
                                : 'Own resources only'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-semibold text-blue-400">
                          <Plus className="h-4 w-4" />
                          Assign
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
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
          </div>

          {/* Footer */}
          <div className="border-t border-gray-700 p-6">
            <button
              onClick={onClose}
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 font-semibold text-white transition-all hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
