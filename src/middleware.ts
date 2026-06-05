/**
 * Next.js Middleware - Route Protection
 * Tuân thủ OWASP ASVS Level 2
 * 
 * Lưu ý: Middleware chỉ dùng để chặn sơ bộ ở route level
 * Quyền chi tiết vẫn phải kiểm tra trong server action/API
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/jwt';
import { verifyTokenEdge } from './lib/jwt-edge';

const AUTH_COOKIE_NAME = 'auth-token';

// Routes yêu cầu đăng nhập
const PROTECTED_ROUTES = ['/admin', '/staff', '/account', '/orders', '/security'];

// Routes chỉ dành cho guest (đã đăng nhập thì không cho vào)
const GUEST_ONLY_ROUTES = ['/login', '/register'];

// Public routes không cần kiểm tra
const PUBLIC_ROUTES = ['/', '/products'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log('[MIDDLEWARE] Request:', pathname);

  // Bỏ qua static files, API routes, và các file đặc biệt
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Lấy token từ cookie
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  console.log('[MIDDLEWARE] Token exists:', !!token);
  
  const payload = await (token ? verifyTokenEdge(token) : Promise.resolve(null));
  const isAuthenticated = payload !== null;

  console.log('[MIDDLEWARE] Token verified:', !!payload);
  console.log('[MIDDLEWARE] Authenticated:', isAuthenticated);
  if (payload) {
    console.log('[MIDDLEWARE] User:', payload.email);
  }

  // Kiểm tra guest-only routes (login, register)
  if (GUEST_ONLY_ROUTES.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      console.log('[MIDDLEWARE] Already logged in, redirect to /account');
      // Đã đăng nhập, redirect về account (account sẽ redirect theo role)
      return NextResponse.redirect(new URL('/account', request.url));
    }
    return NextResponse.next();
  }

  // Kiểm tra protected routes
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !isAuthenticated) {
    console.log('[MIDDLEWARE] Not authenticated, redirect to /login');
    // Chưa đăng nhập, redirect về login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Cho phép truy cập
  console.log('[MIDDLEWARE] Access granted');
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
