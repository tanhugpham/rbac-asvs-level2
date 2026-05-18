'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Award, Key, X } from 'lucide-react';
import { SessionUser } from '@/types/auth';
import { getSecurityLevel, getInitials, getAvatarColor } from '@/lib/utils';

interface WelcomeModalProps {
  user: SessionUser;
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomeModal({ user, isOpen, onClose }: WelcomeModalProps) {
  const securityLevel = getSecurityLevel(user.permissions.length);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 20 }}
            className="relative max-w-md rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 to-gray-800 p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Avatar */}
            <div className="mb-6 flex justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                className={`flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${getAvatarColor(user.roles[0])} text-3xl font-bold text-white shadow-lg`}
              >
                {getInitials(user.name)}
              </motion.div>
            </div>
            
            {/* Welcome Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="mb-2 text-center text-2xl font-bold text-white">
                Xin chào {user.name}
              </h2>
              
              <p className="mb-6 text-center text-gray-400">
                Bạn đang đăng nhập với quyền{' '}
                <span className="font-semibold text-blue-400">{user.roles[0]}</span>
              </p>
            </motion.div>
            
            {/* Security Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6 space-y-3 rounded-lg bg-black/30 p-4 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Key className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-gray-400">Permissions:</span>
                </div>
                <span className="font-semibold text-white">{user.permissions.length}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-gray-400">Security Level:</span>
                </div>
                <span className={`font-semibold ${securityLevel.color}`}>
                  {securityLevel.level}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-gray-400">ASVS Level:</span>
                </div>
                <span className="font-semibold text-purple-400">Level 2</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Last Login:</span>
                <span className="text-sm text-white">
                  {new Date().toLocaleString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </motion.div>
            
            {/* System Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-6 rounded-lg border border-blue-500/30 bg-blue-500/10 p-3"
            >
              <p className="text-center text-xs text-blue-300">
                🛡️ Hệ thống đã cấp <strong>{user.permissions.length} permissions</strong> cho tài khoản của bạn
              </p>
            </motion.div>
            
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={onClose}
              className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
            >
              Tiếp Tục
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
