import { jwtVerify } from 'jose';
import type { JWTPayload } from '@/types/auth';

function getSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error('[JWT EDGE] JWT_SECRET is not defined');
    return null;
  }

  return new TextEncoder().encode(secret);
}

export async function verifyTokenEdge(token: string): Promise<(JWTPayload & { roles: string[] }) | null> {
  try {
    const secret = getSecret();

    if (!secret) {
      return null;
    }

    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
    });

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      roles: (payload.roles as string[]) || [],
    };
  } catch (error) {
    console.error('[JWT EDGE] Verification failed:', error);
    return null;
  }
}