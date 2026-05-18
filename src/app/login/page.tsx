'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Eye, EyeOff, Award, Key, AlertCircle, User } from 'lucide-react';
import { LoadingScreen } from '@/components/ui/Loading';
import { Card, CardContent } from '@/components/ui/Card';

const DEMO_ACCOUNTS = [
  {
    role: 'ADMIN',
    email: 'admin@example.com',
    password: 'Admin@123456',
    color: 'from-blue-500 to-blue-600',
    icon: Shield,
  },
  {
    role: 'STAFF',
    email: 'staff@example.com',
    password: 'Staff@123456',
    color: 'from-purple-500 to-purple-600',
    icon: User,
  },
  {
    role: 'CUSTOMER',
    email: 'an.customer@example.com',
    password: 'Customer@123456',
    color: 'from-green-500 to-green-600',
    icon: User,
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Timeout controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

    try {
      console.log('[LOGIN] Submitting login for:', email);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('[LOGIN] Response status:', response.status);
      const data = await response.json();
      console.log('[LOGIN] Response data:', data);

      if (!data.success) {
        console.log('[LOGIN] Login failed:', data.error?.message);
        setError(data.error?.message || 'Login failed');
        setLoading(false);
        return;
      }

      // Login successful
      console.log('[LOGIN] Login successful!');
      console.log('[LOGIN] User:', data.user);
      console.log('[LOGIN] Redirect to:', data.redirectTo);

      // Redirect to appropriate dashboard
      const redirectUrl = data.redirectTo || '/account';
      console.log('[LOGIN] Redirecting to:', redirectUrl);
      
      router.push(redirectUrl);
      router.refresh();
      
      // Keep loading state until redirect completes
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error('[LOGIN] Error:', err);
      
      if (err.name === 'AbortError') {
        setError('Request timeout. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="relative min-h-screen bg-security-bg bg-cyber-grid flex items-center justify-center p-4">
      {loading && <LoadingScreen />}
      
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block space-y-6"
        >
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-4 shadow-lg shadow-blue-500/50">
              <Shield className="h-12 w-12 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-white mb-2">
                Security Portal
              </h1>
              <p className="text-xl text-gray-400">
                RBAC System - OWASP ASVS Level 2
              </p>
            </div>
          </div>
          
          <div className="space-y-4 mt-8">
            <div className="flex items-start space-x-3 p-4 rounded-lg bg-white/5 border border-white/10">
              <Shield className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white mb-1">Enterprise Security</h3>
                <p className="text-sm text-gray-400">
                  Role-based access control with comprehensive audit logging
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 rounded-lg bg-white/5 border border-white/10">
              <Key className="h-6 w-6 text-purple-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white mb-1">Fine-Grained Permissions</h3>
                <p className="text-sm text-gray-400">
                  17 permissions across 3 roles for precise access control
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 rounded-lg bg-white/5 border border-white/10">
              <Award className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white mb-1">ASVS Level 2 Compliant</h3>
                <p className="text-sm text-gray-400">
                  Meets OWASP Application Security Verification Standard
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md mx-auto"
        >
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-3 shadow-lg shadow-blue-500/50 mb-4">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Security Portal
            </h1>
            <p className="text-gray-400">
              RBAC System - OWASP ASVS Level 2
            </p>
          </div>

          {/* Login Card */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="w-full rounded-lg border border-white/10 bg-black/30 py-3 pl-11 pr-4 text-white placeholder-gray-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      placeholder="admin@example.com"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="w-full rounded-lg border border-white/10 bg-black/30 py-3 pl-11 pr-12 text-white placeholder-gray-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start space-x-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3"
                  >
                    <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500 mt-0.5" />
                    <p className="text-sm text-red-300">{error}</p>
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>
              </form>

              {/* Register Link */}
              <div className="mt-6 text-center text-sm text-gray-400">
                Don't have an account?{' '}
                <Link href="/register" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                  Register
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Demo Accounts */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <p className="text-xs font-semibold text-gray-400 mb-3 text-center">
              DEMO ACCOUNTS - Click to auto-fill
            </p>
            <div className="grid grid-cols-1 gap-2">
              {DEMO_ACCOUNTS.map((account, index) => (
                <motion.button
                  key={account.role}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  onClick={() => fillDemoAccount(account.email, account.password)}
                  className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`rounded-full bg-gradient-to-br ${account.color} p-2`}>
                      <account.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-white">{account.role}</p>
                      <p className="text-xs text-gray-400">{account.email}</p>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-gray-500 group-hover:text-gray-400">
                    Click to fill
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Security Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 flex justify-center space-x-4"
          >
            <div className="flex items-center space-x-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <Shield className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-gray-400">ASVS L2</span>
            </div>
            <div className="flex items-center space-x-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <Key className="h-4 w-4 text-purple-400" />
              <span className="text-xs text-gray-400">RBAC</span>
            </div>
            <div className="flex items-center space-x-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <Award className="h-4 w-4 text-green-400" />
              <span className="text-xs text-gray-400">Secure</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
