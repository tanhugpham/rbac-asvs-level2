import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { MessageCircle, Mail, Phone, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { LogoutButton } from '@/components/LogoutButton';

export default async function CustomerSupportPage() {
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
            <h1 className="text-4xl font-bold text-white">Support</h1>
            <p className="text-gray-400">Liên hệ với đội ngũ hỗ trợ</p>
          </div>
          <LogoutButton variant="default" />
        </div>

        {/* Support Options */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-6 w-6 text-blue-500" />
                <span>Contact Support</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="font-semibold text-white">support@example.com</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      <p className="font-semibold text-white">1900-xxxx</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
                <p className="text-sm text-blue-400">
                  <strong>Support Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM (GMT+7)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-purple-500" />
                <span>Frequently Asked Questions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <h3 className="font-semibold text-white">Làm sao để xem đơn hàng của tôi?</h3>
                  <p className="mt-2 text-sm text-gray-400">
                    Vào mục "My Orders" trong account dashboard để xem tất cả đơn hàng.
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <h3 className="font-semibold text-white">Làm sao để đổi mật khẩu?</h3>
                  <p className="mt-2 text-sm text-gray-400">
                    Vào mục "Security" trong account dashboard và chọn "Change Password".
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <h3 className="font-semibold text-white">Tôi quên mật khẩu, phải làm sao?</h3>
                  <p className="mt-2 text-sm text-gray-400">
                    Vui lòng liên hệ support qua email hoặc phone để được hỗ trợ reset mật khẩu.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <MessageCircle className="h-6 w-6 flex-shrink-0 text-green-400" />
                <div>
                  <h3 className="font-semibold text-green-400">Need More Help?</h3>
                  <p className="mt-1 text-sm text-gray-300">
                    Nếu bạn không tìm thấy câu trả lời, vui lòng liên hệ support team.
                    Chúng tôi sẽ phản hồi trong vòng 24 giờ.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
