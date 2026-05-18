/**
 * JWT Utilities for Edge Runtime (Middleware)
 * Uses jose library which is compatible with Edge Runtime
 */

import { SignJWT, jwtVerify } from 'jose';
import { JWTPayload } from '@/types/auth';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

// Convert secret to Uint8Array for jose
const secret = new TextEncoder().encode(JWT_SECRET);

/**
 * Verify JWT token in Edge Runtime
 * Returns payload if valid, null if invalid
 */
export async function verifyTokenEdge(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
    });
    
    return {
      userId: payload.userId as string,
      email: payload.email as string,
    };
  } catch (error) {
    console.error('[JWT EDGE] Verification failed:', error);
    return null;
  }
}

/**
 * Sign JWT token in Edge Runtime
 */
export async function signTokenEdge(payload: JWTPayload): Promise<string> {
  try {
    const token = await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRES_IN)
      .sign(secret);
    
    return token;
  } catch (error) {
    console.error('[JWT EDGE] Signing failed:', error);
    throw error;
  }
}
