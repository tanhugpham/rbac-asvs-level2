'use client';

import { motion } from 'framer-motion';
import { PERMISSIONS, ROLES, ROLE_PERMISSIONS } from '@/types/auth';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Check, X, Shield, ArrowRight, Lock, Key, Database, FileCheck } from 'lucide-react';
import Link from 'next/link';
import { getDashboardPath } from '@/lib/dashboard-routes';

export function SecurityVisualization() {
  const permissionsList = Object.values(PERMISSIONS);
  const rolesList = Object.values(ROLES);

  return (
    <div className="min-h-screen bg-security-bg bg-cyber-grid p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link 
            href={getDashboardPath(ROLES.ADMIN)}
            className="mb-4 inline-flex items-center text-sm text-gray-400 transition-colors hover:text-white"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="mb-2 text-4xl font-bold text-white">Security Visualization</h1>
          <p className="text-gray-400">RBAC Permission Matrix & Authorization Flow</p>
        </motion.div>
        
        {/* RBAC Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-blue-500" />
                <span>RBAC Permission Matrix</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="p-4 text-left text-sm font-semibold text-gray-400">
                        Permission
                      </th>
                      {rolesList.map((role) => (
                        <th key={role} className="p-4 text-center text-sm font-semibold text-gray-400">
                          {role}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {permissionsList.map((permission, index) => (
                      <motion.tr
                        key={permission}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.02 }}
                        className="border-b border-white/5 transition-colors hover:bg-white/5"
                      >
                        <td className="p-4 font-mono text-sm text-gray-300">
                          {permission}
                        </td>
                        {rolesList.map((role) => {
                          const hasPermission = ROLE_PERMISSIONS[role].includes(permission);
                          return (
                            <td key={role} className="p-4 text-center">
                              {hasPermission ? (
                                <div className="flex justify-center">
                                  <div className="rounded-full bg-green-500/20 p-1">
                                    <Check className="h-5 w-5 text-green-500" />
                                  </div>
                                </div>
                              ) : (
                                <div className="flex justify-center">
                                  <div className="rounded-full bg-red-500/20 p-1">
                                    <X className="h-5 w-5 text-red-500" />
                                  </div>
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="rounded-full bg-green-500/20 p-1">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                  <span className="text-gray-400">Allowed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="rounded-full bg-red-500/20 p-1">
                    <X className="h-4 w-4 text-red-500" />
                  </div>
                  <span className="text-gray-400">Denied</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Role Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 grid gap-6 md:grid-cols-3"
        >
          {rolesList.map((role, index) => {
            const permissions = ROLE_PERMISSIONS[role];
            const colorMap = {
              ADMIN: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-500' },
              STAFF: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-500' },
              CUSTOMER: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-500' },
            };
            const colors = colorMap[role as keyof typeof colorMap];

            return (
              <Card key={role} className={`border ${colors.border} ${colors.bg}`}>
                <CardHeader>
                  <CardTitle className={`flex items-center space-x-2 ${colors.text}`}>
                    <Shield className="h-5 w-5" />
                    <span>{role}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-gray-400">
                    {permissions.length} permissions
                  </p>
                  <div className="space-y-2">
                    {permissions.map((permission) => (
                      <div
                        key={permission}
                        className="flex items-center space-x-2 text-xs text-gray-300"
                      >
                        <Key className="h-3 w-3 text-gray-500" />
                        <span className="font-mono">{permission}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>
        
        {/* Authorization Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileCheck className="h-6 w-6 text-purple-500" />
                <span>Authorization Flow</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    step: 1, 
                    title: 'Request', 
                    description: 'User sends request to protected resource',
                    icon: ArrowRight,
                    color: 'blue'
                  },
                  { 
                    step: 2, 
                    title: 'Middleware', 
                    description: 'Check authentication (JWT token in cookie)',
                    icon: Shield,
                    color: 'purple'
                  },
                  { 
                    step: 3, 
                    title: 'JWT Verify', 
                    description: 'Validate token signature, expiry, and payload',
                    icon: Key,
                    color: 'green'
                  },
                  { 
                    step: 4, 
                    title: 'Permission Check', 
                    description: 'Query database for user roles and permissions',
                    icon: Database,
                    color: 'orange'
                  },
                  { 
                    step: 5, 
                    title: 'Decision', 
                    description: 'Allow or Deny based on required permissions',
                    icon: Lock,
                    color: 'red'
                  },
                  { 
                    step: 6, 
                    title: 'Audit Log', 
                    description: 'Log the access attempt (success or failure)',
                    icon: FileCheck,
                    color: 'yellow'
                  },
                  { 
                    step: 7, 
                    title: 'Response', 
                    description: 'Return data (200) or error (401/403)',
                    icon: ArrowRight,
                    color: 'blue'
                  },
                ].map((item, index) => {
                  const colorClasses = {
                    blue: 'bg-blue-500/20 text-blue-500',
                    purple: 'bg-purple-500/20 text-purple-500',
                    green: 'bg-green-500/20 text-green-500',
                    orange: 'bg-orange-500/20 text-orange-500',
                    red: 'bg-red-500/20 text-red-500',
                    yellow: 'bg-yellow-500/20 text-yellow-500',
                  };

                  return (
                    <motion.div
                      key={item.step}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="flex items-start space-x-4"
                    >
                      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${colorClasses[item.color as keyof typeof colorClasses]}`}>
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <item.icon className="h-5 w-5 text-gray-400" />
                          <h3 className="font-semibold text-white">{item.title}</h3>
                        </div>
                        <p className="mt-1 text-sm text-gray-400">{item.description}</p>
                      </div>
                      {index < 6 && (
                        <div className="flex h-10 items-center">
                          <ArrowRight className="h-5 w-5 text-gray-600" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* ASVS Compliance Note */}
              <div className="mt-8 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-400" />
                  <div>
                    <h4 className="font-semibold text-blue-400">OWASP ASVS Level 2 Compliance</h4>
                    <p className="mt-1 text-sm text-gray-300">
                      All authorization checks are performed server-side. Client-side UI restrictions 
                      are for UX only - the server always validates permissions before granting access 
                      to resources. Failed authorization attempts are logged for security auditing.
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
