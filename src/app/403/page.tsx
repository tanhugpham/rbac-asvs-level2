'use client';

/**
 * 403 Forbidden Page - Security Style
 */

import { motion } from 'framer-motion';
import { ShieldAlert, Lock, ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SecurityExplanationCard } from '@/components/SecurityExplanationCard';

export default function ForbiddenPage() {
  const searchParams = useSearchParams();
  const resource = searchParams.get('resource') || 'this resource';
  const permission = searchParams.get('permission') || 'unknown';
  const role = searchParams.get('role') || 'UNKNOWN';

  return (
    <div className="min-h-screen bg-security-bg bg-cyber-grid">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl">
          {/* Animated Shield Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="mb-8 flex justify-center"
          >
            <motion.div
              animate={{ 
                boxShadow: [
                  '0 0 20px rgba(239, 68, 68, 0.3)',
                  '0 0 40px rgba(239, 68, 68, 0.6)',
                  '0 0 20px rgba(239, 68, 68, 0.3)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative rounded-full bg-red-500/10 p-8"
            >
              <ShieldAlert className="h-24 w-24 text-red-500" />
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Lock className="h-12 w-12 text-red-400" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Error Code */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4 text-center"
          >
            <h1 className="mb-2 text-8xl font-bold text-red-500">403</h1>
            <h2 className="text-3xl font-bold text-white">ACCESS DENIED</h2>
          </motion.div>

          {/* Main Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 text-center"
          >
            <p className="text-lg text-gray-300">
              Bạn không có quyền truy cập tài nguyên này.
            </p>
            <p className="mt-2 text-sm text-gray-400">
              You do not have permission to access {resource}
            </p>
          </motion.div>

          {/* Security Explanation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <SecurityExplanationCard
              type="denied"
              title="Truy Cập Bị Từ Chối"
              message="Yêu cầu của bạn đã được kiểm tra qua middleware, JWT verification và permission validation. Hệ thống phát hiện bạn không có quyền cần thiết để truy cập tài nguyên này."
              details={{
                currentRole: role,
                requiredPermission: permission,
                resource: resource,
                timestamp: new Date().toLocaleString('vi-VN'),
              }}
              asvsCompliance="OWASP ASVS Level 2 yêu cầu mọi authorization phải được kiểm tra server-side. Hệ thống đã từ chối truy cập và ghi log sự kiện này."
            />
          </motion.div>

          {/* Warning Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8 rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-6"
          >
            <div className="flex items-start space-x-3">
              <AlertTriangle className="mt-1 h-6 w-6 text-yellow-500" />
              <div>
                <h3 className="font-semibold text-yellow-500">Lưu Ý Bảo Mật</h3>
                <p className="mt-2 text-sm text-gray-300">
                  Hành vi truy cập trái phép đã được ghi lại trong audit log. 
                  Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ quản trị viên hệ thống.
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  Unauthorized access attempts are logged and monitored.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center space-x-4"
          >
            <Link
              href="/account"
              className="flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Quay Về Trang Chủ</span>
            </Link>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 text-center text-xs text-gray-500"
          >
            <p>Security Incident ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
            <p className="mt-1">Timestamp: {new Date().toISOString()}</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
