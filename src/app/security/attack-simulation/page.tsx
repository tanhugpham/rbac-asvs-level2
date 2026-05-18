'use client';

/**
 * Live Attack Simulation Page
 * Demonstrate RBAC security enforcement in real-time
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Play,
  AlertTriangle,
  Info,
  Zap,
  Target,
  Lock,
  Key,
  Database,
  ShieldAlert,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { AttackSimulationTerminal } from '@/components/security/AttackSimulationTerminal';
import { LogoutButton } from '@/components/LogoutButton';
import type { AttackSimulationResult, AttackScenario } from '@/types/auth';
import { SEVERITY_COLORS } from '@/lib/security-constants';

const ATTACK_SCENARIOS = [
  {
    id: 'customer_access_admin' as AttackScenario,
    name: 'Customer → Admin Dashboard',
    description: 'CUSTOMER attempts to access admin dashboard',
    severity: 'HIGH' as const,
    icon: Target,
  },
  {
    id: 'staff_modify_admin_role' as AttackScenario,
    name: 'Staff → Modify Admin Role',
    description: 'STAFF attempts to modify ADMIN role permissions',
    severity: 'CRITICAL' as const,
    icon: Lock,
  },
  {
    id: 'customer_view_other_order' as AttackScenario,
    name: 'Customer → Other User Order',
    description: 'CUSTOMER attempts to view another user\'s order',
    severity: 'HIGH' as const,
    icon: Database,
  },
  {
    id: 'fake_jwt_token' as AttackScenario,
    name: 'Fake JWT Token',
    description: 'Attacker sends forged JWT token',
    severity: 'CRITICAL' as const,
    icon: Key,
  },
  {
    id: 'missing_permission' as AttackScenario,
    name: 'Missing Permission',
    description: 'Valid user without required permission',
    severity: 'MEDIUM' as const,
    icon: ShieldAlert,
  },
  {
    id: 'expired_token' as AttackScenario,
    name: 'Expired Token',
    description: 'User with expired JWT token',
    severity: 'LOW' as const,
    icon: Zap,
  },
];

export default function AttackSimulationPage() {
  const [selectedScenario, setSelectedScenario] = useState<AttackScenario | null>(null);
  const [simulation, setSimulation] = useState<AttackSimulationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRunSimulation = async (scenario: AttackScenario) => {
    setIsLoading(true);
    setSelectedScenario(scenario);
    setSimulation(null);
    setIsRunning(false);

    try {
      const response = await fetch('/api/security/simulate-attack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Simulation failed');
      }

      const data = await response.json();
      setSimulation(data.simulation);
      setIsRunning(true);
    } catch (error: any) {
      console.error('[ATTACK SIMULATION] Error:', error);
      alert(`Simulation failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSimulation(null);
    setIsRunning(false);
    setSelectedScenario(null);
  };

  return (
    <div className="min-h-screen bg-security-bg bg-cyber-grid p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/50">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Live Attack Simulation</h1>
                <p className="text-gray-400">
                  Demonstrate RBAC security enforcement in real-time
                </p>
              </div>
            </div>
            <LogoutButton variant="default" />
          </div>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="border-blue-500/30 bg-blue-500/10">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 flex-shrink-0 text-blue-400" />
                <div className="flex-1 text-sm text-gray-300">
                  <p className="font-semibold text-blue-400">About This Demo</p>
                  <p className="mt-1">
                    Select an attack scenario to see how the RBAC system detects and blocks
                    unauthorized access attempts. Each simulation shows the complete authorization
                    flow with real-time terminal output.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Scenario Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardHeader>
                <CardTitle>Attack Scenarios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {ATTACK_SCENARIOS.map((scenario, idx) => {
                  const Icon = scenario.icon;
                  const severityColor = SEVERITY_COLORS[scenario.severity];
                  const isSelected = selectedScenario === scenario.id;

                  return (
                    <motion.button
                      key={scenario.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                      onClick={() => handleRunSimulation(scenario.id)}
                      disabled={isLoading}
                      className={`w-full rounded-lg border p-4 text-left transition-all ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                      } ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${severityColor.bg}`}
                        >
                          <Icon className={`h-5 w-5 ${severityColor.text}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white">{scenario.name}</h3>
                            <span
                              className={`rounded px-2 py-0.5 text-xs font-medium ${severityColor.bg} ${severityColor.text}`}
                            >
                              {scenario.severity}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-400">{scenario.description}</p>
                          {isSelected && isLoading && (
                            <div className="mt-2 flex items-center gap-2 text-xs text-cyan-400">
                              <div className="h-3 w-3 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
                              <span>Loading simulation...</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </CardContent>
            </Card>

            {/* OWASP ASVS Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-6"
            >
              <Card className="border-green-500/30 bg-green-500/10">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 flex-shrink-0 text-green-400" />
                    <div className="text-sm">
                      <p className="font-semibold text-green-400">OWASP ASVS Level 2</p>
                      <p className="mt-1 text-gray-300">
                        All simulations demonstrate compliance with OWASP Application Security
                        Verification Standard Level 2 requirements.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Terminal Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <AttackSimulationTerminal
              simulation={simulation}
              isRunning={isRunning}
              onReset={handleReset}
            />
          </motion.div>
        </div>

        {/* Warning Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-6"
        >
          <Card className="border-yellow-500/30 bg-yellow-500/10">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 text-yellow-400" />
                <div className="text-sm text-gray-300">
                  <p className="font-semibold text-yellow-400">Demo Purpose Only</p>
                  <p className="mt-1">
                    These simulations are for demonstration purposes. All attacks are blocked by
                    server-side authorization. Real attack attempts are logged and monitored.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
