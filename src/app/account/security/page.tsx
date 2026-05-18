import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Shield, Lock, Key, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { LogoutButton } from '@/components/LogoutButton';

export default async function CustomerSecurityPage() {
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
            <h1 className="text-4xl font-bold text-white">Security Settings</h1>
            <p className="text-gray-400">Quản lý bảo mật tài khoản</p>
          </div>
          <LogoutButton variant="default" />
        </div>

        {/* Security Options */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-6 w-6 text-blue-500" />
                <span>Password</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">Change Password</p>
                  <p className="text-sm text-gray-400">
                    Cập nhật mật khẩu để bảo vệ tài khoản
                  </p>
                </div>
                <button className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700">
                  Change Password
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-6 w-6 text-purple-500" />
                <span>Two-Factor Authentication</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">Enable 2FA</p>
                  <p className="text-sm text-gray-400">
                    Thêm lớp bảo mật cho tài khoản của bạn
                  </p>
                </div>
                <button className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 font-semibold text-white transition-colors hover:bg-white/10">
                  Enable 2FA
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Shield className="h-6 w-6 flex-shrink-0 text-green-400" />
                <div>
                  <h3 className="font-semibold text-green-400">OWASP ASVS Level 2 Protected</h3>
                  <p className="mt-1 text-sm text-gray-300">
                    Tài khoản của bạn được bảo vệ bởi các biện pháp bảo mật chuẩn OWASP ASVS Level 2:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-gray-400">
                    <li>• Password được hash với bcrypt</li>
                    <li>• JWT token được lưu trong httpOnly cookie</li>
                    <li>• Mọi truy cập đều được audit log</li>
                    <li>• Authorization được kiểm tra server-side</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-500/30 bg-yellow-500/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 flex-shrink-0 text-yellow-400" />
                <div>
                  <h3 className="font-semibold text-yellow-400">Security Tips</h3>
                  <ul className="mt-2 space-y-1 text-sm text-gray-300">
                    <li>• Không chia sẻ mật khẩu với bất kỳ ai</li>
                    <li>• Sử dụng mật khẩu mạnh (ít nhất 8 ký tự)</li>
                    <li>• Đăng xuất sau khi sử dụng trên máy chung</li>
                    <li>• Kiểm tra URL trước khi đăng nhập</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
