/**
 * API Route: Simulate Security Attack
 * POST /api/security/simulate-attack
 */

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, getCurrentUser } from '@/lib/auth';
import { PERMISSIONS } from '@/types/auth';
import { simulateAttack } from '@/lib/attack-simulation';
import type { AttackScenario } from '@/types/auth';
import { z } from 'zod';

const simulateAttackSchema = z.object({
  scenario: z.enum([
    'customer_access_admin',
    'staff_modify_admin_role',
    'customer_view_other_order',
    'fake_jwt_token',
    'missing_permission',
    'expired_token',
  ]),
});

export async function POST(request: NextRequest) {
  try {
    console.log('[SIMULATE ATTACK] Request received');

    // Require AUDIT_READ permission (ADMIN only)
    const user = await requirePermission(PERMISSIONS.AUDIT_READ);
    console.log('[SIMULATE ATTACK] Permission granted:', user.email);

    // Parse request body
    const body = await request.json();
    const result = simulateAttackSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid scenario', details: result.error.issues },
        { status: 400 }
      );
    }

    const { scenario } = result.data;
    console.log('[SIMULATE ATTACK] Simulating scenario:', scenario);

    // Simulate the attack
    const simulation = await simulateAttack(scenario as AttackScenario, user.id);

    console.log('[SIMULATE ATTACK] Simulation complete:', {
      scenario: simulation.scenarioName,
      blocked: simulation.blocked,
      blockedAt: simulation.blockedAt,
    });

    return NextResponse.json({
      success: true,
      simulation,
    });
  } catch (error: any) {
    console.error('[SIMULATE ATTACK] Error:', error);

    if (error.message?.includes('Permission denied')) {
      return NextResponse.json(
        { error: 'Permission denied: audit:read required' },
        { status: 403 }
      );
    }

    if (error.message?.includes('Authentication required')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
