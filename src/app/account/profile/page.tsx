import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { User, Mail, Shield } from 'lucide-react';
import Link from 'next/link';
import { LogoutButton } from '@/components/LogoutButton';

export default async function CustomerProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-security-bg bg-cyber-grid p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link 
              href="/account"
              className="mb-4 inline-flex items-center text-sm text-gray-400 transition-colors hover:text-white"
            >
              ← Back to Account
            </Link>
            <h1 className="text-4xl font-bold text-white">Profile Settings</h1>
            <p className="text-gray-400">Quản lý thông tin cá nhân</p>
          </div>
          <LogoutButton variant="default" />
        </div>

        {/* Profile Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6 text-blue-500" />
              <span>Account Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Name</p>
                    <p className="font-semibold text-white">{user.name}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-semibold text-white">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Role</p>
                    <p className="font-semibold text-white">{user.roles.join(', ')}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Permissions</p>
                    <p className="font-semibold text-white">{user.permissions.length} permissions</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
              <p className="text-sm text-blue-400">
                <strong>Note:</strong> Để cập nhật thông tin cá nhân, vui lòng liên hệ support.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
