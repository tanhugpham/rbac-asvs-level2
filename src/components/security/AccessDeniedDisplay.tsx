'use client';

import { motion } from 'framer-motion';
import { ShieldX, AlertTriangle, Lock, ArrowLeft, Info } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import type { AccessDeniedInfo } from '@/types/auth';
import { format } from 'date-fns';

interface AccessDeniedDisplayProps {
  info: AccessDeniedInfo;
  showDetails?: boolean;
}

export function AccessDeniedDisplay({ info, showDetails = true }: AccessDeniedDisplayProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-security-bg bg-cyber-grid p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-full max-w-2xl"
      >
        {/* Shield Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
          className="mb-8 flex justify-center"
        >
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 rounded-full bg-red-500/30 blur-xl"
            />
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-red-500/50 bg-gradient-to-br from-red-500/20 to-red-600/20">
              <ShieldX className="h-16 w-16 text-red-500" />
            </div>
          </div>
        </motion.div>

        {/* Main Card */}
        <Card className="border-red-500/30 bg-gradient-to-br from-red-500/10 to-red-600/5">
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Title */}
              <div className="text-center">
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-red-500"
                >
                  Access Denied
                </motion.h1>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-2 text-gray-400"
                >
                  Bạn không có quyền truy cập tài nguyên này
                </motion.p>
              </div>

              {/* Details */}
              {showDetails && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                      <p className="mb-1 text-sm text-gray-400">Your Roles</p>
                      <div className="flex flex-wrap gap-2">
                        {info.currentRoles.map((role) => (
                          <span
                            key={role}
                            className="rounded-full bg-blue-500/20 px-3 py-1 text-sm font-medium text-blue-400"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                      <p className="mb-1 text-sm text-gray-400">Required Permission</p>
                      <code className="text-sm font-mono text-red-400">
                        {info.requiredPermission}
                      </code>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                      <p className="mb-1 text-sm text-gray-400">Requested Path</p>
                      <code className="text-sm font-mono text-gray-300">{info.requestPath}</code>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                      <p className="mb-1 text-sm text-gray-400">Timestamp</p>
                      <p className="text-sm text-gray-300">
                        {format(info.timestamp, 'dd/MM/yyyy HH:mm:ss')}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 flex-shrink-0 text-yellow-500" />
                      <div>
                        <p className="font-semibold text-yellow-500">Reason</p>
                        <p className="mt-1 text-sm text-gray-300">{info.reason}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* OWASP ASVS Info */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4"
              >
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 flex-shrink-0 text-blue-400" />
                  <div>
                    <p className="font-semibold text-blue-400">OWASP ASVS Level 2</p>
                    <p className="mt-1 text-sm text-gray-300">
                      Hệ thống thực hiện kiểm tra phân quyền ở server-side (V4.1.1). Mọi request
                      đều được validate quyền truy cập trước khi xử lý. Access control fail
                      securely - mặc định từ chối nếu không đủ quyền (V4.1.5).
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <Link
                  href="/account"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 font-semibold text-white transition-all hover:from-cyan-600 hover:to-blue-600"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Go to Dashboard
                </Link>
                <Link
                  href="/security/rbac-matrix"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white transition-all hover:bg-white/10"
                >
                  <Lock className="h-5 w-5" />
                  View Permissions
                </Link>
              </motion.div>

              {/* Audit Log Notice */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center text-sm text-gray-500"
              >
                This access attempt has been logged for security audit purposes.
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
