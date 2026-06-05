'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, ShieldCheck, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        if (data.error?.issues) {
          setError(data.error.issues.map((e: any) => e.message).join(', '));
        } else {
          setError(data.error?.message || 'Registration failed');
        }
        return;
      }

      window.location.href = '/account';
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0e1a] bg-cyber-grid px-4 py-10 text-white">
      <div className="mx-auto flex w-full max-w-md flex-col items-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30">
          <ShieldCheck className="h-9 w-9 text-white" />
        </div>

        <h1 className="text-center text-4xl font-bold">Security Portal</h1>
        <p className="mt-2 text-center text-slate-400">
          Create RBAC protected account
        </p>

        <div className="mt-10 w-full rounded-3xl border border-slate-700/80 bg-slate-900/80 p-8 shadow-2xl backdrop-blur">
          <h2 className="mb-8 text-3xl font-bold">Register</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold text-slate-300">
                Name
              </label>
              <div className="flex items-center rounded-xl border border-slate-700 bg-slate-950/70 px-4 focus-within:border-blue-500">
                <User className="mr-3 h-5 w-5 text-slate-400" />
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  autoComplete="name"
                  className="w-full bg-transparent py-4 text-white outline-none placeholder:text-slate-500"
                  placeholder="Nguyễn Văn An"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-slate-300">
                Email Address
              </label>
              <div className="flex items-center rounded-xl border border-slate-700 bg-slate-950/70 px-4 focus-within:border-blue-500">
                <Mail className="mr-3 h-5 w-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  autoComplete="email"
                  className="w-full bg-transparent py-4 text-white outline-none placeholder:text-slate-500"
                  placeholder="user@gmail.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-slate-300">
                Password
              </label>
              <div className="flex items-center rounded-xl border border-slate-700 bg-slate-950/70 px-4 focus-within:border-blue-500">
                <Lock className="mr-3 h-5 w-5 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  autoComplete="new-password"
                  className="w-full bg-transparent py-4 text-white outline-none placeholder:text-slate-500"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-xs leading-relaxed text-slate-500">
                Must be at least 8 characters with uppercase, lowercase, number,
                and special character.
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-4 font-bold text-white transition hover:from-blue-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-blue-400 hover:text-blue-300">
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}