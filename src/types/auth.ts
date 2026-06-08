/**
 * TypeScript Types cho Authentication & Authorization
 */

export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  user?: SessionUser;
  error?: string;
}

// Ma trận quyền hạn RBAC
export const PERMISSIONS = {
  // User Management
  USER_READ: 'user:read',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',

  // Role Management
  ROLE_READ: 'role:read',
  ROLE_CREATE: 'role:create',
  ROLE_UPDATE: 'role:update',
  ROLE_DELETE: 'role:delete',

  // Product Management
  PRODUCT_READ: 'product:read',
  PRODUCT_CREATE: 'product:create',
  PRODUCT_UPDATE: 'product:update',
  PRODUCT_DELETE: 'product:delete',

  // Order Management
  ORDER_READ: 'order:read', // Xem tất cả đơn hàng (admin/staff)
  ORDER_CREATE: 'order:create', // Tạo đơn hàng mới
  ORDER_MANAGE: 'order:manage', // Quản lý đơn hàng (cập nhật status, etc.)
  ORDER_READ_OWN: 'order:read_own', // Xem đơn hàng của chính mình

  // Account Secret (thông tin tài khoản sau khi mua)
  ACCOUNT_READ_SECRET: 'account:read_secret',

  // Audit Log
  AUDIT_READ: 'audit:read',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Định nghĩa các vai trò
export const ROLES = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  CUSTOMER: 'CUSTOMER',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// Ma trận quyền cho từng vai trò
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN: [
    // Admin có toàn quyền
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.ROLE_READ,
    PERMISSIONS.ROLE_CREATE,
    PERMISSIONS.ROLE_UPDATE,
    PERMISSIONS.ROLE_DELETE,
    PERMISSIONS.PRODUCT_READ,
    PERMISSIONS.PRODUCT_CREATE,
    PERMISSIONS.PRODUCT_UPDATE,
    PERMISSIONS.PRODUCT_DELETE,
    PERMISSIONS.ORDER_READ,
    PERMISSIONS.ORDER_CREATE,
    PERMISSIONS.ORDER_MANAGE,
    PERMISSIONS.ACCOUNT_READ_SECRET,
    PERMISSIONS.AUDIT_READ,
  ],
  STAFF: [
    // Staff quản lý sản phẩm và đơn hàng, không quản lý role
    PERMISSIONS.USER_READ,
    PERMISSIONS.PRODUCT_READ,
    PERMISSIONS.PRODUCT_CREATE,
    PERMISSIONS.PRODUCT_UPDATE,
    PERMISSIONS.PRODUCT_DELETE,
    PERMISSIONS.ORDER_READ,
    PERMISSIONS.ORDER_CREATE,
    PERMISSIONS.ORDER_MANAGE,
    PERMISSIONS.ACCOUNT_READ_SECRET,
  ],
  CUSTOMER: [
    // Customer chỉ xem sản phẩm và đơn hàng của chính mình
    PERMISSIONS.PRODUCT_READ,
    PERMISSIONS.ORDER_CREATE,
    PERMISSIONS.ORDER_READ_OWN,
  ],
};

// Security Analytics Types
export interface SecurityEvent {
  id: string;
  timestamp: Date;
  userId?: string;
  userEmail?: string;
  action: string;
  resource: string;
  result: 'SUCCESS' | 'DENIED' | 'ERROR';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  ipAddress?: string;
  userAgent?: string;
  details?: string;
}

export interface SecurityAnalytics {
  totalRequests: number;
  deniedRequests: number;
  successfulRequests: number;
  suspiciousRequests: number;
  activeUsers: number;
  topDeniedPermissions: Array<{ permission: string; count: number }>;
  requestsByDay: Array<{ date: string; success: number; denied: number }>;
  roleDistribution: Array<{ role: string; count: number }>;
}

export interface ActiveSession {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  roles: string[];
  loginTime: Date;
  lastActivity: Date;
  ipAddress?: string;
  userAgent?: string;
  browser?: string;
  device?: string;
}

export interface RBACMatrixCell {
  role: Role;
  permission: Permission;
  allowed: boolean;
  description?: string;
}

export interface AuthorizationFlowStep {
  step: number;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'success' | 'error';
  details?: string;
}

export interface AccessDeniedInfo {
  timestamp: Date;
  userId: string;
  userEmail: string;
  currentRoles: string[];
  requiredPermission: string;
  requestPath: string;
  reason: string;
}

// Attack Simulation Types
export type AttackScenario =
  | 'customer_access_admin'
  | 'staff_modify_admin_role'
  | 'customer_view_other_order'
  | 'fake_jwt_token'
  | 'missing_permission'
  | 'expired_token';

export interface AttackSimulationStep {
  step: number;
  layer: string;
  action: string;
  status: 'pending' | 'processing' | 'success' | 'blocked' | 'error';
  message: string;
  timestamp: Date;
  details?: string;
  asvsReference?: string;
  blockCriteria?: string;
}

export interface AttackSimulationResult {
  scenario: AttackScenario;
  scenarioName: string;
  description: string;
  attacker: {
    role: string;
    email: string;
  };
  target: {
    resource: string;
    requiredPermission: string;
  };
  steps: AttackSimulationStep[];
  blocked: boolean;
  blockedAt: string;
  asvsCompliance: string[];
  auditLogId?: string;
}