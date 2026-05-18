import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Security Portal - RBAC System',
  description: 'Role-Based Access Control System compliant with OWASP ASVS Level 2',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <body className={`${inter.variable} bg-security-bg text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
