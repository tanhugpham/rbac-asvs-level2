/**
 * JWT Utilities
 * Tuân thủ OWASP ASVS Level 2 - Secure token generation and validation
 */

import jwt from 'jsonwebtoken';
import { JWTPayload } from '@/types/auth';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d'; // Token hết hạn sau 7 ngày

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

/**
 * Tạo JWT token
 */
export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: 'HS256',
  });
}

/**
 * Xác thực và giải mã JWT token
 * Trả về null nếu token không hợp lệ (fail securely)
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    }) as JWTPayload;
    return decoded;
  } catch (error) {
    // Token không hợp lệ hoặc hết hạn
    return null;
  }
}

/**
 * Giải mã token mà không xác thực (dùng cho debug, không dùng cho authorization)
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
}
