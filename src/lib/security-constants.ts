/**
 * Security Constants for Interactive Security Demonstration Platform
 * OWASP ASVS Level 2 Compliant
 */

import { PERMISSIONS, ROLES, type Permission, type Role } from '@/types/auth';

// Route Protection Matrix
export const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
  // Admin Routes
  '/admin/dashboard': [PERMISSIONS.AUDIT_READ],
  '/admin/users': [PERMISSIONS.USER_READ],
  '/admin/roles': [PERMISSIONS.ROLE_READ],
  '/admin/permissions': [PERMISSIONS.ROLE_READ],
  '/admin/audit-logs': [PERMISSIONS.AUDIT_READ],
  '/admin/security': [PERMISSIONS.AUDIT_READ],
  '/admin/analytics': [PERMISSIONS.AUDIT_READ],
  '/admin/sessions': [PERMISSIONS.USER_READ, PERMISSIONS.AUDIT_READ],

  // Staff Routes
  '/staff/dashboard': [PERMISSIONS.PRODUCT_READ, PERMISSIONS.ORDER_READ],
  '/staff/orders': [PERMISSIONS.ORDER_READ],
  '/staff/products': [PERMISSIONS.PRODUCT_READ],
  '/staff/support': [PERMISSIONS.USER_READ],

  // Customer Routes
  '/account': [PERMISSIONS.ORDER_READ_OWN],
  '/account/orders': [PERMISSIONS.ORDER_READ_OWN],
  '/account/profile': [PERMISSIONS.ORDER_READ_OWN],
  '/account/security': [PERMISSIONS.ORDER_READ_OWN],
  '/account/support': [PERMISSIONS.ORDER_READ_OWN],

  // Security Visualization Routes (Admin only)
  '/security/flow': [PERMISSIONS.AUDIT_READ],
  '/security/rbac-matrix': [PERMISSIONS.ROLE_READ],
  '/security/analytics': [PERMISSIONS.AUDIT_READ],
};

// Permission Descriptions for UI
export const PERMISSION_DESCRIPTIONS: Record<Permission, string> = {
  [PERMISSIONS.USER_READ]: 'Xem danh sách người dùng',
  [PERMISSIONS.USER_CREATE]: 'Tạo người dùng mới',
  [PERMISSIONS.USER_UPDATE]: 'Cập nhật thông tin người dùng',
  [PERMISSIONS.USER_DELETE]: 'Xóa người dùng',
  [PERMISSIONS.ROLE_READ]: 'Xem danh sách vai trò',
  [PERMISSIONS.ROLE_CREATE]: 'Tạo vai trò mới',
  [PERMISSIONS.ROLE_UPDATE]: 'Cập nhật vai trò',
  [PERMISSIONS.ROLE_DELETE]: 'Xóa vai trò',
  [PERMISSIONS.PRODUCT_READ]: 'Xem danh sách sản phẩm',
  [PERMISSIONS.PRODUCT_CREATE]: 'Tạo sản phẩm mới',
  [PERMISSIONS.PRODUCT_UPDATE]: 'Cập nhật sản phẩm',
  [PERMISSIONS.PRODUCT_DELETE]: 'Xóa sản phẩm',
  [PERMISSIONS.ORDER_CREATE]: 'Tạo đơn hàng mới',
  [PERMISSIONS.ORDER_READ]: 'Xem tất cả đơn hàng',
  [PERMISSIONS.ORDER_MANAGE]: 'Quản lý đơn hàng',
  [PERMISSIONS.ORDER_READ_OWN]: 'Xem đơn hàng của chính mình',
  [PERMISSIONS.ACCOUNT_READ_SECRET]: 'Xem thông tin tài khoản bí mật',
  [PERMISSIONS.AUDIT_READ]: 'Xem nhật ký kiểm toán',
};

// Role Descriptions
export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  [ROLES.ADMIN]: 'Quản trị viên - Toàn quyền truy cập hệ thống',
  [ROLES.STAFF]: 'Nhân viên - Quản lý sản phẩm và đơn hàng',
  [ROLES.CUSTOMER]: 'Khách hàng - Xem và quản lý đơn hàng của mình',
};

// Role Colors for UI
export const ROLE_COLORS: Record<Role, { bg: string; text: string; border: string }> = {
  [ROLES.ADMIN]: {
    bg: 'bg-red-500/10',
    text: 'text-red-500',
    border: 'border-red-500/30',
  },
  [ROLES.STAFF]: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-500',
    border: 'border-blue-500/30',
  },
  [ROLES.CUSTOMER]: {
    bg: 'bg-green-500/10',
    text: 'text-green-500',
    border: 'border-green-500/30',
  },
};

// Severity Colors
export const SEVERITY_COLORS = {
  LOW: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/30' },
  MEDIUM: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/30' },
  HIGH: { bg: 'bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500/30' },
  CRITICAL: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/30' },
};

// Authorization Flow Steps
export const AUTHORIZATION_FLOW_STEPS = [
  {
    step: 1,
    name: 'User Request',
    description: 'User gửi request tới protected route',
  },
  {
    step: 2,
    name: 'Middleware',
    description: 'Next.js middleware kiểm tra JWT token',
  },
  {
    step: 3,
    name: 'JWT Verification',
    description: 'Verify JWT signature và expiration',
  },
  {
    step: 4,
    name: 'Get User Session',
    description: 'Lấy thông tin user từ database',
  },
  {
    step: 5,
    name: 'Role Validation',
    description: 'Kiểm tra user có role phù hợp',
  },
  {
    step: 6,
    name: 'Permission Check',
    description: 'Kiểm tra user có permission cần thiết',
  },
  {
    step: 7,
    name: 'Resource Ownership',
    description: 'Kiểm tra quyền sở hữu tài nguyên (nếu cần)',
  },
  {
    step: 8,
    name: 'Authorization Decision',
    description: 'Quyết định Allow hoặc Deny',
  },
  {
    step: 9,
    name: 'Audit Logging',
    description: 'Ghi log hành động vào audit trail',
  },
  {
    step: 10,
    name: 'Response',
    description: 'Trả về response hoặc redirect',
  },
];

// OWASP ASVS Level 2 Requirements
export const ASVS_REQUIREMENTS = [
  {
    id: 'V4.1.1',
    category: 'Access Control',
    requirement: 'Verify that the application enforces access control rules on a trusted service layer',
    implementation: 'Server-side authorization in API routes và server components',
  },
  {
    id: 'V4.1.2',
    category: 'Access Control',
    requirement: 'Verify that all user and data attributes used by access controls are protected',
    implementation: 'JWT token httpOnly, roles/permissions từ database',
  },
  {
    id: 'V4.1.3',
    category: 'Access Control',
    requirement: 'Verify that the principle of least privilege exists',
    implementation: 'RBAC matrix với permissions chi tiết cho từng role',
  },
  {
    id: 'V4.1.5',
    category: 'Access Control',
    requirement: 'Verify that access controls fail securely',
    implementation: 'Default deny, throw errors khi unauthorized',
  },
  {
    id: 'V7.1.1',
    category: 'Error Handling',
    requirement: 'Verify that the application does not log credentials or payment details',
    implementation: 'Audit logs không chứa password hoặc sensitive data',
  },
  {
    id: 'V8.3.4',
    category: 'Session Management',
    requirement: 'Verify that cookie-based session tokens have secure attributes',
    implementation: 'httpOnly, sameSite: lax, secure in production',
  },
];

// Demo Mode Data
export const DEMO_USERS = [
  {
    name: 'Nguyễn Văn An',
    email: 'admin@example.com',
    role: ROLES.ADMIN,
  },
  {
    name: 'Trần Thị Bình',
    email: 'staff@example.com',
    role: ROLES.STAFF,
  },
  {
    name: 'Lê Văn Cường',
    email: 'an.customer@example.com',
    role: ROLES.CUSTOMER,
  },
];
