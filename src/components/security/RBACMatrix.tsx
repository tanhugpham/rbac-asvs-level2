'use client';

import { motion } from 'framer-motion';
import { Check, X, Info } from 'lucide-react';
import { PERMISSIONS, ROLE_PERMISSIONS, ROLES, type Permission, type Role } from '@/types/auth';
import { PERMISSION_DESCRIPTIONS, ROLE_COLORS } from '@/lib/security-constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useState } from 'react';

export function RBACMatrix() {
  const [hoveredCell, setHoveredCell] = useState<{ role: Role; permission: Permission } | null>(
    null
  );

  const roles = Object.values(ROLES);
  const permissions = Object.values(PERMISSIONS);

  const hasPermission = (role: Role, permission: Permission): boolean => {
    return ROLE_PERMISSIONS[role].includes(permission);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">RBAC Permission Matrix</h2>
          <p className="text-gray-400">
            Ma trận quyền hạn theo vai trò - OWASP ASVS Level 2
          </p>
        </div>
      </div>

      {/* Matrix */}
      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-white/10 bg-white/5 p-4 text-left text-sm font-semibold text-white">
                    Permission
                  </th>
                  {roles.map((role) => (
                    <th
                      key={role}
                      className={`border border-white/10 p-4 text-center text-sm font-semibold ${ROLE_COLORS[role].text}`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span>{role}</span>
                        <span className="text-xs font-normal text-gray-400">
                          ({ROLE_PERMISSIONS[role].length} perms)
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissions.map((permission, idx) => (
                  <motion.tr
                    key={permission}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="hover:bg-white/5"
                  >
                    <td className="border border-white/10 p-4">
                      <div className="flex items-center gap-2">
                        <code className="text-sm text-cyan-400">{permission}</code>
                        <div className="group relative">
                          <Info className="h-4 w-4 text-gray-500" />
                          <div className="absolute left-0 top-6 z-10 hidden w-64 rounded-lg border border-white/10 bg-gray-900 p-3 text-xs text-gray-300 shadow-xl group-hover:block">
                            {PERMISSION_DESCRIPTIONS[permission]}
                          </div>
                        </div>
                      </div>
                    </td>
                    {roles.map((role) => {
                      const allowed = hasPermission(role, permission);
                      return (
                        <td
                          key={`${role}-${permission}`}
                          className="border border-white/10 p-4 text-center"
                          onMouseEnter={() => setHoveredCell({ role, permission })}
                          onMouseLeave={() => setHoveredCell(null)}
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: idx * 0.02 + 0.1 }}
                            className="flex justify-center"
                          >
                            {allowed ? (
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                                <Check className="h-5 w-5 text-green-500" />
                              </div>
                            ) : (
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
                                <X className="h-5 w-5 text-red-500" />
                              </div>
                            )}
                          </motion.div>
                        </td>
                      );
                    })}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Legend</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="font-semibold text-white">Allowed</p>
                <p className="text-sm text-gray-400">Role có permission này</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
                <X className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="font-semibold text-white">Denied</p>
                <p className="text-sm text-gray-400">Role không có permission này</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
            <p className="text-sm text-blue-400">
              <strong>OWASP ASVS V4.1.3:</strong> Verify that the principle of least privilege
              exists - mỗi role chỉ có permissions cần thiết cho công việc của họ.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
