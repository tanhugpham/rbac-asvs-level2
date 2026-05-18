'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Terminal as TerminalIcon,
  Play,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import type { AttackSimulationResult, AttackSimulationStep } from '@/types/auth';

interface AttackSimulationTerminalProps {
  simulation: AttackSimulationResult | null;
  isRunning: boolean;
  onReset: () => void;
}

export function AttackSimulationTerminal({
  simulation,
  isRunning,
  onReset,
}: AttackSimulationTerminalProps) {
  const [visibleSteps, setVisibleSteps] = useState<AttackSimulationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!simulation || !isRunning) {
      setVisibleSteps([]);
      setCurrentStepIndex(0);
      return;
    }

    // Animate steps one by one
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < simulation.steps.length) {
          setVisibleSteps((steps) => [...steps, simulation.steps[prev]]);
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 600); // 600ms between steps

    return () => clearInterval(timer);
  }, [simulation, isRunning]);

  const getStatusIcon = (status: AttackSimulationStep['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'blocked':
        return <ShieldX className="h-4 w-4 text-red-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 animate-spin text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: AttackSimulationStep['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-400';
      case 'blocked':
        return 'text-red-400';
      case 'error':
        return 'text-red-400';
      case 'processing':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  if (!simulation) {
    return (
      <Card className="border-gray-700 bg-gray-900/50">
        <CardContent className="flex h-[600px] items-center justify-center p-6">
          <div className="text-center">
            <TerminalIcon className="mx-auto mb-4 h-16 w-16 text-gray-600" />
            <p className="text-gray-400">Select an attack scenario to begin simulation</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-cyan-500/30 bg-gray-900/90 font-mono">
      <CardHeader className="border-b border-cyan-500/30 bg-gray-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20">
              <TerminalIcon className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <CardTitle className="text-cyan-400">Attack Simulation Terminal</CardTitle>
              <p className="text-sm text-gray-400">{simulation.scenarioName}</p>
            </div>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400 transition-all hover:bg-cyan-500/20"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Terminal Output */}
        <div className="h-[500px] overflow-y-auto bg-black/50 p-6">
          {/* Scenario Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 border-l-4 border-yellow-500 bg-yellow-500/10 p-4"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 text-yellow-500" />
              <div className="flex-1">
                <p className="font-semibold text-yellow-400">Attack Scenario</p>
                <p className="mt-1 text-sm text-gray-300">{simulation.description}</p>
                <div className="mt-3 grid gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Attacker:</span>{' '}
                    <span className="text-red-400">
                      {simulation.attacker.role} ({simulation.attacker.email})
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Target:</span>{' '}
                    <span className="text-cyan-400">{simulation.target.resource}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Required Permission:</span>{' '}
                    <span className="text-purple-400">{simulation.target.requiredPermission}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Steps */}
          <div className="space-y-4">
            <AnimatePresence>
              {visibleSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`border-l-2 pl-4 ${
                    step.status === 'blocked'
                      ? 'border-red-500'
                      : step.status === 'success'
                      ? 'border-green-500'
                      : 'border-gray-600'
                  }`}
                >
                  {/* Step Header */}
                  <div className="flex items-start gap-3">
                    {getStatusIcon(step.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          [{new Date(step.timestamp).toLocaleTimeString()}]
                        </span>
                        <span className="rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-400">
                          {step.layer}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-semibold text-white">{step.action}</p>
                      <p className={`mt-1 text-sm ${getStatusColor(step.status)}`}>
                        {step.message}
                      </p>

                      {/* Details */}
                      {step.details && (
                        <div className="mt-2 rounded bg-gray-900/50 p-2 text-xs text-gray-400">
                          {step.details}
                        </div>
                      )}

                      {/* ASVS Reference */}
                      {step.asvsReference && (
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          <Shield className="h-3 w-3 text-blue-400" />
                          <span className="text-blue-400">{step.asvsReference}</span>
                        </div>
                      )}

                      {/* Blocked Highlight */}
                      {step.status === 'blocked' && (
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="mt-3 rounded-lg border border-red-500/50 bg-red-500/10 p-3"
                        >
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-red-500" />
                            <div>
                              <p className="font-semibold text-red-400">🛡️ ATTACK BLOCKED</p>
                              <p className="mt-1 text-xs text-gray-300">
                                Security layer successfully prevented unauthorized access
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Final Result */}
          {visibleSteps.length === simulation.steps.length && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              {/* Blocked Summary */}
              <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-6 w-6 flex-shrink-0 text-green-500" />
                  <div className="flex-1">
                    <p className="font-semibold text-green-400">✅ Attack Successfully Blocked</p>
                    <p className="mt-1 text-sm text-gray-300">
                      Blocked at: <span className="text-green-400">{simulation.blockedAt}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* OWASP ASVS Compliance */}
              <div className="mt-4 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 flex-shrink-0 text-blue-400" />
                  <div className="flex-1">
                    <p className="font-semibold text-blue-400">OWASP ASVS Level 2 Compliance</p>
                    <ul className="mt-2 space-y-1 text-xs text-gray-300">
                      {simulation.asvsCompliance.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-green-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Audit Log */}
              {simulation.auditLogId && (
                <div className="mt-4 rounded-lg border border-purple-500/30 bg-purple-500/10 p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-purple-400" />
                    <span className="text-purple-400">
                      Security event logged: <code className="text-xs">{simulation.auditLogId}</code>
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Terminal Footer */}
        <div className="border-t border-cyan-500/30 bg-gray-900/50 px-6 py-3">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              Steps: {visibleSteps.length} / {simulation.steps.length}
            </span>
            <span>Status: {visibleSteps.length === simulation.steps.length ? 'Complete' : 'Running...'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
