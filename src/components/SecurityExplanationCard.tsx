'use client';

/**
 * Security Explanation Card
 * Giải thích cách RBAC hoạt động
 */

import { motion } from 'framer-motion';
import { Shield, Info, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

interface SecurityExplanationProps {
  type: 'success' | 'denied' | 'warning' | 'info';
  title: string;
  message: string;
  details?: {
    currentRole?: string;
    requiredPermission?: string;
    resource?: string;
    timestamp?: string;
  };
  asvsCompliance?: string;
}

export function SecurityExplanationCard({
  type,
  title,
  message,
  details,
  asvsCompliance,
}: SecurityExplanationProps) {
  const icons = {
    success: <CheckCircle className="h-6 w-6 text-green-500" />,
    denied: <XCircle className="h-6 w-6 text-red-500" />,
    warning: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
    info: <Info className="h-6 w-6 text-blue-500" />,
  };

  const colors = {
    success: 'border-green-500/30 bg-green-500/5',
    denied: 'border-red-500/30 bg-red-500/5',
    warning: 'border-yellow-500/30 bg-yellow-500/5',
    info: 'border-blue-500/30 bg-blue-500/5',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`${colors[type]} border-2`} glow>
        <CardHeader>
          <div className="flex items-start space-x-3">
            <div className="mt-1">{icons[type]}</div>
            <div className="flex-1">
              <CardTitle className="text-lg">{title}</CardTitle>
              <p className="mt-2 text-sm text-gray-300">{message}</p>
            </div>
          </div>
        </CardHeader>

        {details && (
          <CardContent>
            <div className="space-y-2 rounded-lg bg-black/20 p-4">
              {details.currentRole && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Current Role:</span>
                  <span className="font-mono text-white">{details.currentRole}</span>
                </div>
              )}
              {details.requiredPermission && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Required Permission:</span>
                  <span className="font-mono text-yellow-400">{details.requiredPermission}</span>
                </div>
              )}
              {details.resource && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Resource:</span>
                  <span className="font-mono text-blue-400">{details.resource}</span>
                </div>
              )}
              {details.timestamp && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Timestamp:</span>
                  <span className="font-mono text-gray-300">{details.timestamp}</span>
                </div>
              )}
            </div>
          </CardContent>
        )}

        {asvsCompliance && (
          <CardContent className="pt-0">
            <div className="flex items-start space-x-2 rounded-lg border border-blue-500/30 bg-blue-500/5 p-3">
              <Shield className="mt-0.5 h-4 w-4 text-blue-400" />
              <div>
                <p className="text-xs font-semibold text-blue-400">OWASP ASVS Level 2</p>
                <p className="mt-1 text-xs text-gray-300">{asvsCompliance}</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}
