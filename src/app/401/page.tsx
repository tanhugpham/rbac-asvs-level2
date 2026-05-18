'use client';

/**
 * 401 Unauthorized Page
 */

import { motion } from 'framer-motion';
import { KeyRound, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-security-bg bg-cyber-grid">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="mb-8 flex justify-center"
          >
            <div className="relative rounded-full bg-yellow-500/10 p-8">
              <KeyRound className="h-24 w-24 text-yellow-500" />
              <motion.div
                animate={{ rotate: [0, -15, 15, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Lock className="h-12 w-12 text-yellow-400" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 text-center"
          >
            <h1 className="mb-2 text-8xl font-bold text-yellow-500">401</h1>
            <h2 className="text-3xl font-bold text-white">AUTHENTICATION REQUIRED</h2>
            <p className="mt-4 text-lg text-gray-300">
              Bạn cần đăng nhập để truy cập tài nguyên này.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center"
          >
            <Link
              href="/login"
              className="flex items-center space-x-2 rounded-lg bg-blue-600 px-8 py-4 font-semibold text-white transition-all hover:bg-blue-700"
            >
              <span>Đăng Nhập Ngay</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
