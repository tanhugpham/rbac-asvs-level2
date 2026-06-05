import Link from 'next/link';
import { Shield, Key, Award, ShoppingCart, Users, Lock, ArrowRight, CheckCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-security-bg bg-cyber-grid">
      {/* Navigation Bar */}
      <nav className="border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-2 shadow-lg shadow-blue-500/30">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Security Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="rounded-lg border border-white/10 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-24">
        {/* Background decoration */}
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-400">
            <Shield className="h-4 w-4" />
            OWASP ASVS Level 2 Compliant
          </div>
          
          <h1 className="mb-6 text-5xl font-bold leading-tight text-white md:text-6xl">
            Role-Based Access Control
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Security Platform
            </span>
          </h1>
          
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-400">
            Enterprise-grade authentication and authorization system with granular permissions,
            audit logging, and comprehensive security controls.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-bold text-white shadow-xl transition-all hover:from-blue-500 hover:to-purple-500 hover:shadow-2xl"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-xl border border-white/10 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-white/10"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-white/10 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">Enterprise Features</h2>
            <p className="text-gray-400">
              Comprehensive security features designed for production environments
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Lock,
                title: 'JWT Authentication',
                description: 'Secure JSON Web Token authentication with HTTP-only cookies and refresh tokens.',
                color: 'text-blue-500',
                bgColor: 'bg-blue-500/10',
                borderColor: 'border-blue-500/30',
              },
              {
                icon: Key,
                title: 'Role-Based Access Control',
                description: 'Fine-grained permissions with 3 roles: Admin, Staff, and Customer.',
                color: 'text-purple-500',
                bgColor: 'bg-purple-500/10',
                borderColor: 'border-purple-500/30',
              },
              {
                icon: Shield,
                title: 'Permission Management',
                description: '17 granular permissions across the system for precise access control.',
                color: 'text-green-500',
                bgColor: 'bg-green-500/10',
                borderColor: 'border-green-500/30',
              },
              {
                icon: Users,
                title: 'User Management',
                description: 'Administrators can manage users, assign roles, and oversee permissions.',
                color: 'text-yellow-500',
                bgColor: 'bg-yellow-500/10',
                borderColor: 'border-yellow-500/30',
              },
              {
                icon: ShoppingCart,
                title: 'Product Management',
                description: 'Staff can manage products while customers browse and purchase securely.',
                color: 'text-pink-500',
                bgColor: 'bg-pink-500/10',
                borderColor: 'border-pink-500/30',
              },
              {
                icon: Award,
                title: 'ASVS Level 2 Compliance',
                description: 'Meets OWASP ASVS Level 2 standards for web application security.',
                color: 'text-cyan-500',
                bgColor: 'bg-cyan-500/10',
                borderColor: 'border-cyan-500/30',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`group rounded-xl border ${feature.borderColor} ${feature.bgColor} p-6 transition-all hover:scale-[1.02]`}
              >
                <div className={`mb-4 inline-flex rounded-lg ${feature.bgColor} p-3`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Accounts Section */}
      <section className="border-t border-white/10 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">Test Accounts</h2>
            <p className="text-gray-400">
              Use these pre-configured accounts to explore all features
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                role: 'Admin',
                email: 'admin@example.com',
                password: 'Admin@123456',
                permissions: 'Full access to all features',
                color: 'from-blue-500 to-blue-600',
                borderColor: 'border-blue-500/30',
                bgColor: 'bg-blue-500/5',
              },
              {
                role: 'Staff',
                email: 'staff@example.com',
                password: 'Staff@123456',
                permissions: 'Product & order management',
                color: 'from-purple-500 to-purple-600',
                borderColor: 'border-purple-500/30',
                bgColor: 'bg-purple-500/5',
              },
              {
                role: 'Customer',
                email: 'customer@example.com',
                password: 'Customer@123456',
                permissions: 'Browse products & manage orders',
                color: 'from-green-500 to-green-600',
                borderColor: 'border-green-500/30',
                bgColor: 'bg-green-500/5',
              },
            ].map((account) => (
              <div
                key={account.role}
                className={`rounded-xl border ${account.borderColor} ${account.bgColor} p-6 text-center transition-all hover:scale-[1.02]`}
              >
                <div className={`mx-auto mb-4 inline-flex rounded-full bg-gradient-to-br ${account.color} p-3`}>
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-1 text-xl font-bold text-white">{account.role}</h3>
                <p className="mb-3 text-sm text-gray-400">{account.permissions}</p>
                <div className="space-y-1 rounded-lg bg-black/30 p-3 text-left font-mono text-xs">
                  <p className="text-gray-400">
                    <span className="text-gray-500">Email:</span>{' '}
                    <span className="text-white">{account.email}</span>
                  </p>
                  <p className="text-gray-400">
                    <span className="text-gray-500">Pass:</span>{' '}
                    <span className="text-white">{account.password}</span>
                  </p>
                </div>
                <Link
                  href="/login"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 py-2 text-sm font-semibold text-white transition-all hover:bg-white/10"
                >
                  Login as {account.role}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Overview */}
      <section className="border-t border-white/10 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">Security Features</h2>
            <p className="text-gray-400">
              Built-in protection against common web vulnerabilities
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              'JWT-based authentication with HTTP-only cookies',
              'Role-Based Access Control (RBAC)',
              'Fine-grained permissions (17 permissions)',
              'Server-side authorization checks',
              'Audit logging for security events',
              'Fail-secure by default',
              'Vertical & horizontal privilege escalation protection',
              'Secure session management',
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                <span className="text-sm text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Shield className="h-4 w-4" />
            Security Portal - RBAC System
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>OWASP ASVS Level 2</span>
            <span>•</span>
            <span>RBAC v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}