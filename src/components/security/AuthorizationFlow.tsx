'use client';

import { motion } from 'framer-motion';
import {
  User,
  Shield,
  Key,
  Database,
  CheckCircle,
  Lock,
  FileText,
  AlertCircle,
  ArrowDown,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { AUTHORIZATION_FLOW_STEPS } from '@/lib/security-constants';

const stepIcons = [
  User,
  Shield,
  Key,
  Database,
  CheckCircle,
  Lock,
  FileText,
  CheckCircle,
  FileText,
  AlertCircle,
];

export function AuthorizationFlow() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Authorization Flow</h2>
        <p className="text-gray-400">
          Luồng xác thực và phân quyền theo OWASP ASVS Level 2
        </p>
      </div>

      {/* Flow Diagram */}
      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-cyan-500 via-blue-500 to-purple-500 opacity-30" />

        {/* Steps */}
        <div className="relative space-y-8">
          {AUTHORIZATION_FLOW_STEPS.map((step, idx) => {
            const Icon = stepIcons[idx];
            const isEven = idx % 2 === 0;

            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex items-center gap-8 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {/* Content Card */}
                <div className={`flex-1 ${isEven ? 'text-right' : 'text-left'}`}>
                  <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-blue-500/5">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {!isEven && (
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500/20">
                            <Icon className="h-6 w-6 text-cyan-400" />
                          </div>
                        )}
                        <div className={`flex-1 ${isEven ? 'text-right' : 'text-left'}`}>
                          <div className="mb-2 flex items-center gap-2">
                            {isEven && (
                              <span className="text-sm font-mono text-cyan-400">
                                Step {step.step}
                              </span>
                            )}
                            <h3 className="flex-1 text-lg font-bold text-white">{step.name}</h3>
                            {!isEven && (
                              <span className="text-sm font-mono text-cyan-400">
                                Step {step.step}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">{step.description}</p>
                        </div>
                        {isEven && (
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500/20">
                            <Icon className="h-6 w-6 text-cyan-400" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Center Node */}
                <div className="relative z-10 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-4 border-gray-900 bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/50">
                  <span className="text-xl font-bold text-white">{step.step}</span>
                </div>

                {/* Spacer for alignment */}
                <div className="flex-1" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ASVS Compliance Note */}
      <Card className="border-green-500/30 bg-green-500/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-500" />
            <div>
              <h3 className="mb-2 font-bold text-green-500">OWASP ASVS Level 2 Compliant</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <strong>V4.1.1:</strong> Access control enforced on trusted service layer
                  (server-side)
                </li>
                <li>
                  <strong>V4.1.2:</strong> User attributes protected (JWT httpOnly, database roles)
                </li>
                <li>
                  <strong>V4.1.3:</strong> Principle of least privilege (RBAC matrix)
                </li>
                <li>
                  <strong>V4.1.5:</strong> Access controls fail securely (default deny)
                </li>
                <li>
                  <strong>V7.1.1:</strong> No credentials in logs (audit logs sanitized)
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
