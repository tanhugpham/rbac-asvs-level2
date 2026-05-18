/**
 * Authorization Core - Lớp kiểm tra quyền tập trung
 * Tuân thủ OWASP ASVS Level 2
 * 
 * Nguyên tắc:
 * 1. Mọi kiểm tra quyền phải thực hiện ở server-side
 * 2. Fail securely - mặc định từ chối nếu thiếu thông tin
 * 3. Không tin dữ liệu từ client
 * 4. Ghi log mọi lần bị từ chối
 */

import { cookies } from 'next/headers';
import { cache } from 'react';
import { prisma } from './prisma';
import { verifyToken } from './jwt';
import { SessionUser, Permission } from '@/types/auth';
import { UnauthorizedError, ForbiddenError, NotFoundError } from './errors';
import { logAuthorizationFailure } from './audit';

const AUTH_COOKIE_NAME = 'auth-token';

/**
 * Lấy thông tin user hiện tại từ JWT cookie
 * Cache trong request để tránh query database nhiều lần
 * Trả về null nếu không có session (fail securely)
 */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  try {
    console.log('[AUTH] getCurrentUser called');
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      console.log('[AUTH] No token found');
      return null;
    }

    // Xác thực JWT token
    const payload = verifyToken(token);
    if (!payload) {
      console.log('[AUTH] Invalid token');
      return null;
    }

    console.log('[AUTH] Token valid, userId:', payload.userId);

    // Lấy thông tin user từ database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || !user.isActive) {
      console.log('[AUTH] User not found or inactive');
      return null;
    }

    // Tổng hợp roles và permissions
    const roles = user.userRoles.map((ur) => ur.role.name);
    const permissionsSet = new Set<string>();

    user.userRoles.forEach((ur) => {
      ur.role.rolePermissions.forEach((rp) => {
        permissionsSet.add(rp.permission.name);
      });
    });

    console.log('[AUTH] User loaded:', user.email, 'Roles:', roles);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      roles,
      permissions: Array.from(permissionsSet),
    };
  } catch (error) {
    console.error('[AUTH] Error getting current user:', error);
    return null;
  }
});

/**
 * Lấy danh sách permissions của user
 */
export async function getUserPermissions(userId: string): Promise<string[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    return [];
  }

  const permissionsSet = new Set<string>();
  user.userRoles.forEach((ur) => {
    ur.role.rolePermissions.forEach((rp) => {
      permissionsSet.add(rp.permission.name);
    });
  });

  return Array.from(permissionsSet);
}

/**
 * Kiểm tra user có permission cụ thể không
 */
export async function hasPermission(
  userId: string,
  permission: Permission
): Promise<boolean> {
  const permissions = await getUserPermissions(userId);
  return permissions.includes(permission);
}

/**
 * Yêu cầu user phải đăng nhập
 * Throw UnauthorizedError nếu chưa đăng nhập
 */
export async function requireAuth(): Promise<SessionUser> {
  console.log('[AUTH] requireAuth called');
  const user = await getCurrentUser();

  if (!user) {
    console.log('[AUTH] requireAuth failed - no user');
    await logAuthorizationFailure(
      undefined,
      'authentication',
      'auth:required',
      'User not authenticated'
    );
    throw new UnauthorizedError('Authentication required');
  }

  console.log('[AUTH] requireAuth success:', user.email);
  return user;
}

/**
 * Yêu cầu user phải có permission cụ thể
 * Throw ForbiddenError nếu không đủ quyền
 */
export async function requirePermission(
  permission: Permission,
  resource?: string
): Promise<SessionUser> {
  const user = await requireAuth();

  if (!user.permissions.includes(permission)) {
    await logAuthorizationFailure(
      user.id,
      resource || 'unknown',
      permission,
      'Permission denied'
    );
    throw new ForbiddenError(`Permission denied: ${permission}`);
  }

  return user;
}

/**
 * Yêu cầu user phải có ít nhất một trong các permissions
 */
export async function requireAnyPermission(
  permissions: Permission[],
  resource?: string
): Promise<SessionUser> {
  const user = await requireAuth();

  const hasAny = permissions.some((p) => user.permissions.includes(p));

  if (!hasAny) {
    await logAuthorizationFailure(
      user.id,
      resource || 'unknown',
      permissions.join(', '),
      'None of required permissions found'
    );
    throw new ForbiddenError('Access denied');
  }

  return user;
}

/**
 * Yêu cầu user phải là chủ sở hữu tài nguyên HOẶC có permission cụ thể
 * Dùng cho trường hợp: user xem order của chính mình, hoặc admin/staff xem tất cả
 * 
 * @param resourceOwnerId - ID của chủ sở hữu tài nguyên
 * @param permission - Permission cần thiết nếu không phải chủ sở hữu
 * @param throwNotFound - Nếu true, throw NotFoundError thay vì ForbiddenError (để che giấu tài nguyên)
 */
export async function requireOwnershipOrPermission(
  resourceOwnerId: string,
  permission: Permission,
  throwNotFound = true
): Promise<SessionUser> {
  const user = await requireAuth();

  // Kiểm tra xem user có phải chủ sở hữu không
  const isOwner = user.id === resourceOwnerId;

  // Kiểm tra xem user có permission không
  const hasRequiredPermission = user.permissions.includes(permission);

  if (!isOwner && !hasRequiredPermission) {
    await logAuthorizationFailure(
      user.id,
      `resource:${resourceOwnerId}`,
      permission,
      'Not owner and no permission'
    );

    // Throw NotFoundError để che giấu sự tồn tại của tài nguyên
    if (throwNotFound) {
      throw new NotFoundError('Resource not found');
    }

    throw new ForbiddenError('Access denied');
  }

  return user;
}

/**
 * Kiểm tra user có role cụ thể không
 */
export async function hasRole(userId: string, roleName: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!user) {
    return false;
  }

  return user.userRoles.some((ur) => ur.role.name === roleName);
}

/**
 * Yêu cầu user phải có role cụ thể
 * ADMIN có thể access tất cả roles
 */
export async function requireRole(roleName: string): Promise<SessionUser> {
  console.log('[AUTH] requireRole called:', roleName);
  const user = await requireAuth();

  // ADMIN có thể access tất cả
  if (user.roles.includes('ADMIN')) {
    console.log('[AUTH] requireRole success - user is ADMIN');
    return user;
  }

  // Kiểm tra role cụ thể
  if (!user.roles.includes(roleName)) {
    console.log('[AUTH] requireRole failed - user roles:', user.roles, 'required:', roleName);
    await logAuthorizationFailure(
      user.id,
      'role_check',
      `role:${roleName}`,
      'Role not found'
    );
    throw new ForbiddenError(`Role required: ${roleName}`);
  }

  console.log('[AUTH] requireRole success');
  return user;
}
