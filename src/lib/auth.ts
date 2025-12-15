import { SignJWT, jwtVerify } from 'jose'
import type { JWTPayload as JoseJWTPayload } from 'jose'

/* ======================================================
   CONFIG
====================================================== */
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'masai-secret-key-change-in-production'
)

const JWT_ALG = 'HS256'
const JWT_EXPIRES = '7d'

/* ======================================================
   TYPES
====================================================== */
export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN'

/**
 * Payload JWT milik aplikasi
 * EXTEND dari jose.JWTPayload (best practice)
 */
export interface AppJWTPayload extends JoseJWTPayload {
  userId: string
  email: string
  name: string
  role: UserRole
}

/* ======================================================
   TOKEN GENERATOR
====================================================== */
export async function generateToken(payload: AppJWTPayload): Promise<string> {
  return await new SignJWT({
    userId: payload.userId,
    email: payload.email,
    name: payload.name,
    role: payload.role
  })
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES)
    .setSubject(payload.userId)
    .sign(JWT_SECRET)
}

/* ======================================================
   TOKEN VERIFIER (TYPE SAFE + RUNTIME VALIDATION)
====================================================== */
export async function verifyToken(
  token: string
): Promise<AppJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)

    // 🔐 Runtime validation (WAJIB)
    if (
      typeof payload.userId !== 'string' ||
      typeof payload.email !== 'string' ||
      typeof payload.name !== 'string' ||
      typeof payload.role !== 'string'
    ) {
      return null
    }

    return payload as AppJWTPayload
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

/* ======================================================
   ROLE CHECKER (RBAC)
====================================================== */
export function isAdmin(role: UserRole): boolean {
  return role === 'ADMIN' || role === 'SUPER_ADMIN'
}

export function isSuperAdmin(role: UserRole): boolean {
  return role === 'SUPER_ADMIN'
}
