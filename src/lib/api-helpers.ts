import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, isAdmin } from './auth'

/* ======================================================
   BASIC AUTH
====================================================== */
export async function withAuth(
  request: NextRequest,
  handler: (req: NextRequest, userId: string) => Promise<NextResponse>
) {
  const authHeader = request.headers.get('authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    )
  }

  const token = authHeader.slice(7)
  const payload = await verifyToken(token)

  if (!payload) {
    return NextResponse.json(
      { success: false, message: 'Invalid token' },
      { status: 401 }
    )
  }

  return handler(request, payload.userId)
}

/* ======================================================
   ADMIN AUTH
====================================================== */
export async function withAdminAuth(
  request: NextRequest,
  handler: (
    req: NextRequest,
    userId: string,
    role: string
  ) => Promise<NextResponse>
) {
  const authHeader = request.headers.get('authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    )
  }

  const token = authHeader.slice(7)
  const payload = await verifyToken(token)

  if (!payload || !isAdmin(payload.role)) {
    return NextResponse.json(
      { success: false, message: 'Forbidden' },
      { status: 403 }
    )
  }

  return handler(request, payload.userId, payload.role)
}
