/**
 * Attack Simulation Helper
 * Simulate various security attacks to demonstrate RBAC enforcement
 */

import type {
  AttackScenario,
  AttackSimulationResult,
  AttackSimulationStep,
} from '@/types/auth';
import { prisma } from './prisma';

/**
 * Simulate an attack scenario
 */
export async function simulateAttack(
  scenario: AttackScenario,
  userId?: string
): Promise<AttackSimulationResult> {
  const scenarios: Record<
    AttackScenario,
    {
      name: string;
      description: string;
      attacker: { role: string; email: string };
      target: { resource: string; requiredPermission: string };
      steps: Omit<AttackSimulationStep, 'timestamp'>[];
      blockedAt: string;
      asvsCompliance: string[];
    }
  > = {
    customer_access_admin: {
      name: 'Customer Accessing Admin Dashboard',
      description: 'CUSTOMER role attempts to access /admin/dashboard',
      attacker: { role: 'CUSTOMER', email: 'an.customer@example.com' },
      target: { resource: '/admin/dashboard', requiredPermission: 'audit:read' },
      steps: [
        {
          step: 1,
          layer: 'Client',
          action: 'User clicks "Admin Dashboard" link',
          status: 'success',
          message: 'Request initiated',
        },
        {
          step: 2,
          layer: 'Middleware',
          action: 'Check authentication',
          status: 'success',
          message: 'JWT token found and valid',
          details: 'Token signature verified, not expired',
        },
        {
          step: 3,
          layer: 'Middleware',
          action: 'Check route protection',
          status: 'success',
          message: 'Route /admin requires authentication',
          details: 'User is authenticated, proceed to authorization',
        },
        {
          step: 4,
          layer: 'Server Component',
          action: 'Load user session',
          status: 'success',
          message: 'User session loaded from database',
          details: 'User: an.customer@example.com, Roles: [CUSTOMER]',
        },
        {
          step: 5,
          layer: 'Authorization',
          action: 'Check permission: audit:read',
          status: 'blocked',
          message: 'Permission denied: CUSTOMER does not have audit:read',
          details: 'User permissions: [product:read, order:read_own]',
          asvsReference: 'V4.1.1: Server-side Access Control (cannot bypass from client)\nV4.1.3: Least Privilege (CUSTOMER has only 2 of 17 permissions)',
        },
        {
          step: 6,
          layer: 'Audit Log',
          action: 'Log access denied',
          status: 'success',
          message: 'Security event logged',
          details: 'Action: ACCESS_DENIED, Status: DENIED, Severity: HIGH',
          asvsReference: 'OWASP ASVS V7.1.1',
        },
        {
          step: 7,
          layer: 'Response',
          action: 'Redirect to /403',
          status: 'success',
          message: 'User redirected to access denied page',
          details: 'HTTP 403 Forbidden with security explanation',
        },
      ],
      blockedAt: 'Authorization Layer (Step 5)',
      asvsCompliance: [
        'V4.1.1: Access control enforced on trusted service layer',
        'V4.1.3: Principle of least privilege - CUSTOMER has minimal permissions',
        'V4.1.5: Access controls fail securely - default deny',
        'V7.1.1: Security event logged without sensitive data',
      ],
    },

    staff_modify_admin_role: {
      name: 'Staff Modifying Admin Role',
      description: 'STAFF role attempts to modify ADMIN role permissions',
      attacker: { role: 'STAFF', email: 'staff@example.com' },
      target: { resource: '/api/roles/admin-id/permissions', requiredPermission: 'role:update' },
      steps: [
        {
          step: 1,
          layer: 'Client',
          action: 'STAFF submits role modification request',
          status: 'success',
          message: 'POST /api/roles/admin-id/permissions',
        },
        {
          step: 2,
          layer: 'Middleware',
          action: 'Verify JWT token',
          status: 'success',
          message: 'Token valid, user authenticated',
          details: 'User: staff@example.com',
        },
        {
          step: 3,
          layer: 'API Route',
          action: 'Parse request body',
          status: 'success',
          message: 'Request body validated',
          details: 'Attempting to add permission: user:delete',
        },
        {
          step: 4,
          layer: 'Authorization',
          action: 'Check permission: role:update',
          status: 'blocked',
          message: 'Permission denied: STAFF does not have role:update',
          details: 'STAFF permissions: [product:*, order:*, user:read]',
          asvsReference: 'V4.1.1: Server-side Access Control (authorization in API route, not UI)\nV4.1.3: Least Privilege (STAFF cannot modify roles - only ADMIN has role:update)',
        },
        {
          step: 5,
          layer: 'Audit Log',
          action: 'Log unauthorized role modification attempt',
          status: 'success',
          message: 'CRITICAL security event logged',
          details: 'Severity: CRITICAL, Action: ROLE_MODIFICATION_DENIED',
          asvsReference: 'OWASP ASVS V7.1.1',
        },
        {
          step: 6,
          layer: 'Response',
          action: 'Return 403 Forbidden',
          status: 'success',
          message: 'API returns error response',
          details: 'JSON: { error: "Permission denied: role:update" }',
        },
      ],
      blockedAt: 'API Authorization Layer (Step 4)',
      asvsCompliance: [
        'V4.1.1: Server-side authorization in API route',
        'V4.1.3: STAFF cannot modify roles (least privilege)',
        'V4.1.5: Fail securely - deny by default',
        'V7.1.1: Critical security event logged',
      ],
    },

    customer_view_other_order: {
      name: 'Customer Viewing Other User Order',
      description: 'CUSTOMER attempts to view order belonging to another user',
      attacker: { role: 'CUSTOMER', email: 'an.customer@example.com' },
      target: { resource: '/api/orders/other-user-order-id', requiredPermission: 'order:read' },
      steps: [
        {
          step: 1,
          layer: 'Client',
          action: 'Request order details',
          status: 'success',
          message: 'GET /api/orders/other-user-order-id',
        },
        {
          step: 2,
          layer: 'Middleware',
          action: 'Authenticate user',
          status: 'success',
          message: 'User authenticated: an.customer@example.com',
        },
        {
          step: 3,
          layer: 'API Route',
          action: 'Fetch order from database',
          status: 'success',
          message: 'Order found in database',
          details: 'Order belongs to: other.customer@example.com',
        },
        {
          step: 4,
          layer: 'Ownership Validation',
          action: 'Check resource ownership',
          status: 'blocked',
          message: 'Ownership validation failed',
          details: 'Order owner: other-user-id, Current user: current-user-id',
          asvsReference: 'V4.1.1: Server-side Ownership Check (not trusting client claims)\nV4.2.1: Resource-level Access Control (order.userId must match currentUser.id)',
        },
        {
          step: 5,
          layer: 'Audit Log',
          action: 'Log unauthorized access attempt',
          status: 'success',
          message: 'Security event logged',
          details: 'Severity: HIGH, Action: UNAUTHORIZED_RESOURCE_ACCESS',
          asvsReference: 'OWASP ASVS V7.1.1',
        },
        {
          step: 6,
          layer: 'Response',
          action: 'Return 404 Not Found',
          status: 'success',
          message: 'Resource hidden from unauthorized user',
          details: 'Return 404 instead of 403 to hide resource existence',
        },
      ],
      blockedAt: 'Ownership Validation Layer (Step 4)',
      asvsCompliance: [
        'V4.1.1: Server-side ownership validation',
        'V4.2.1: Resource-level access control',
        'V4.1.5: Fail securely - hide resource existence',
        'V7.1.1: Unauthorized access logged',
      ],
    },

    fake_jwt_token: {
      name: 'Fake JWT Token Attack',
      description: 'Attacker sends forged JWT token with admin claims',
      attacker: { role: 'ATTACKER', email: 'attacker@malicious.com' },
      target: { resource: '/admin/users', requiredPermission: 'user:read' },
      steps: [
        {
          step: 1,
          layer: 'Client',
          action: 'Send request with fake JWT',
          status: 'success',
          message: 'Request with forged token',
          details: 'Token claims: { userId: "admin", roles: ["ADMIN"] }',
        },
        {
          step: 2,
          layer: 'Middleware',
          action: 'Extract JWT from cookie',
          status: 'success',
          message: 'Token found in auth-token cookie',
        },
        {
          step: 3,
          layer: 'JWT Verification',
          action: 'Verify token signature',
          status: 'blocked',
          message: 'JWT signature verification failed',
          details: 'Token signed with wrong secret or algorithm',
          asvsReference: 'V3.5.2: JWT Signature Verification (token signed by unknown secret rejected)\nV8.3.1: Server-side Session Validation (cannot trust client-provided claims)',
        },
        {
          step: 4,
          layer: 'Audit Log',
          action: 'Log suspicious activity',
          status: 'success',
          message: 'CRITICAL security event logged',
          details: 'Severity: CRITICAL, Action: INVALID_TOKEN_ATTEMPT',
          asvsReference: 'OWASP ASVS V7.1.1',
        },
        {
          step: 5,
          layer: 'Response',
          action: 'Redirect to /login',
          status: 'success',
          message: 'User redirected to login page',
          details: 'Invalid token cleared from cookies',
        },
      ],
      blockedAt: 'JWT Verification Layer (Step 3)',
      asvsCompliance: [
        'V3.5.2: Cryptographic verification of JWT signature',
        'V8.3.1: Session tokens verified on server',
        'V4.1.5: Fail securely - reject invalid tokens',
        'V7.1.1: Suspicious activity logged',
      ],
    },

    missing_permission: {
      name: 'Missing Permission Attack',
      description: 'User with valid token but missing required permission',
      attacker: { role: 'STAFF', email: 'staff@example.com' },
      target: { resource: '/admin/security', requiredPermission: 'audit:read' },
      steps: [
        {
          step: 1,
          layer: 'Client',
          action: 'Request security dashboard',
          status: 'success',
          message: 'GET /admin/security',
        },
        {
          step: 2,
          layer: 'Middleware',
          action: 'Authenticate user',
          status: 'success',
          message: 'Valid JWT token, user authenticated',
        },
        {
          step: 3,
          layer: 'Server Component',
          action: 'Load user permissions',
          status: 'success',
          message: 'User permissions loaded from database',
          details: 'Permissions: [product:*, order:*, user:read]',
        },
        {
          step: 4,
          layer: 'Permission Check',
          action: 'Require permission: audit:read',
          status: 'blocked',
          message: 'Required permission not found',
          details: 'User does not have audit:read permission',
          asvsReference: 'V4.1.1: Server-side Permission Check (each route validates permissions independently)\nV4.1.3: Least Privilege (authenticated ≠ authorized - staff lacks audit:read)',
        },
        {
          step: 5,
          layer: 'Audit Log',
          action: 'Log permission denied',
          status: 'success',
          message: 'Access denied event logged',
          details: 'Severity: MEDIUM, Action: PERMISSION_DENIED',
        },
        {
          step: 6,
          layer: 'Response',
          action: 'Redirect to /403',
          status: 'success',
          message: 'Access denied page with explanation',
        },
      ],
      blockedAt: 'Permission Check Layer (Step 4)',
      asvsCompliance: [
        'V4.1.1: Granular permission checks',
        'V4.1.3: Least privilege enforced',
        'V4.1.5: Fail securely on missing permission',
      ],
    },

    expired_token: {
      name: 'Expired Token Attack',
      description: 'User attempts to use expired JWT token',
      attacker: { role: 'CUSTOMER', email: 'an.customer@example.com' },
      target: { resource: '/account', requiredPermission: 'order:read_own' },
      steps: [
        {
          step: 1,
          layer: 'Client',
          action: 'Send request with old token',
          status: 'success',
          message: 'Request with expired JWT token',
          details: 'Token expired 2 hours ago',
        },
        {
          step: 2,
          layer: 'Middleware',
          action: 'Extract JWT from cookie',
          status: 'success',
          message: 'Token found in cookie',
        },
        {
          step: 3,
          layer: 'JWT Verification',
          action: 'Verify token expiration',
          status: 'blocked',
          message: 'Token expired',
          details: 'Token exp: 2 hours ago, Current time: now',
          asvsReference: 'V3.5.3: Token Expiration (exp claim < current time → token rejected)\nV8.3.2: Session Timeout (automatic logout after 7 days)',
        },
        {
          step: 4,
          layer: 'Audit Log',
          action: 'Log expired token usage',
          status: 'success',
          message: 'Security event logged',
          details: 'Severity: LOW, Action: EXPIRED_TOKEN',
        },
        {
          step: 5,
          layer: 'Response',
          action: 'Clear cookie and redirect',
          status: 'success',
          message: 'Redirect to /login',
          details: 'Expired token cleared from cookies',
        },
      ],
      blockedAt: 'JWT Verification Layer (Step 3)',
      asvsCompliance: [
        'V3.5.3: Token expiration enforced',
        'V8.3.2: Session timeout implemented',
        'V4.1.5: Fail securely - reject expired tokens',
      ],
    },
  };

  const scenarioData = scenarios[scenario];
  const now = new Date();

  // Add timestamps to steps
  const steps: AttackSimulationStep[] = scenarioData.steps.map((step, index) => ({
    ...step,
    timestamp: new Date(now.getTime() + index * 100), // 100ms between steps
  }));

  // Create audit log entry
  let auditLogId: string | undefined;
  try {
    if (userId) {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId,
          action: 'ATTACK_SIMULATION',
          resource: scenarioData.target.resource,
          permission: scenarioData.target.requiredPermission,
          status: 'DENIED',
          details: JSON.stringify({
            scenario,
            scenarioName: scenarioData.name,
            blockedAt: scenarioData.blockedAt,
          }),
        },
      });
      auditLogId = auditLog.id;
    }
  } catch (error) {
    console.error('[ATTACK SIMULATION] Error creating audit log:', error);
  }

  return {
    scenario,
    scenarioName: scenarioData.name,
    description: scenarioData.description,
    attacker: scenarioData.attacker,
    target: scenarioData.target,
    steps,
    blocked: true,
    blockedAt: scenarioData.blockedAt,
    asvsCompliance: scenarioData.asvsCompliance,
    auditLogId,
  };
}

/**
 * Get all available attack scenarios
 */
export function getAttackScenarios(): Array<{
  id: AttackScenario;
  name: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}> {
  return [
    {
      id: 'customer_access_admin',
      name: 'Customer → Admin Dashboard',
      description: 'CUSTOMER attempts to access admin dashboard',
      severity: 'HIGH',
    },
    {
      id: 'staff_modify_admin_role',
      name: 'Staff → Modify Admin Role',
      description: 'STAFF attempts to modify ADMIN role permissions',
      severity: 'CRITICAL',
    },
    {
      id: 'customer_view_other_order',
      name: 'Customer → Other User Order',
      description: 'CUSTOMER attempts to view another user\'s order',
      severity: 'HIGH',
    },
    {
      id: 'fake_jwt_token',
      name: 'Fake JWT Token',
      description: 'Attacker sends forged JWT token',
      severity: 'CRITICAL',
    },
    {
      id: 'missing_permission',
      name: 'Missing Permission',
      description: 'Valid user without required permission',
      severity: 'MEDIUM',
    },
    {
      id: 'expired_token',
      name: 'Expired Token',
      description: 'User with expired JWT token',
      severity: 'LOW',
    },
  ];
}
