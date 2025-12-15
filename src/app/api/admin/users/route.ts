import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/api-helpers'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

/* ======================================================
   GET - Fetch users (ADMIN ONLY)
====================================================== */
export async function GET(request: NextRequest) {
  return withAdminAuth(request, async (_req, adminId) => {

    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const role = searchParams.get('role')
    const page = Number(searchParams.get('page') || 1)
    const limit = Number(searchParams.get('limit') || 10)
    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } }
      ]
    }

    if (role && role !== 'ALL') {
      where.role = role
    }

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          is_active: true,
          last_login: true,
          created_at: true,
          _count: {
            select: {
              estimations: true,
              applications: true
            }
          }
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit
      }),
      db.user.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  })
}

export async function POST(request: NextRequest) {
  return withAdminAuth(request, async (_req, adminId) => {

    const { email, name, phone, password, role } = await request.json()

    if (!email || !name || !password) {
      return NextResponse.json(
        { success: false, error: 'Required fields missing' },
        { status: 400 }
      )
    }

    const exists = await db.user.findUnique({ where: { email } })
    if (exists) {
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 409 }
      )
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = await db.user.create({
      data: {
        email,
        name,
        phone,
        password_hash: hashed,
        role: role ?? 'USER',
        is_active: true
      }
    })

    await db.auditLog.create({
      data: {
        user_id: adminId,
        action: 'CREATE',
        resource: 'user',
        resource_id: user.id,
        new_values: JSON.stringify(user)
      }
    })

    return NextResponse.json({ success: true, data: user })
  })
}

export async function PUT(request: NextRequest) {
  return withAdminAuth(request, async (_req, adminId) => {

    const body = await request.json()
    const { user_id, password, ...rest } = body

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      )
    }

    if (password) {
      rest.password_hash = await bcrypt.hash(password, 10)
    }

    const updated = await db.user.update({
      where: { id: user_id },
      data: rest
    })

    await db.auditLog.create({
      data: {
        user_id: adminId,
        action: 'UPDATE',
        resource: 'user',
        resource_id: user_id,
        new_values: JSON.stringify(updated)
      }
    })

    return NextResponse.json({ success: true, data: updated })
  })
}

export async function DELETE(request: NextRequest) {
  return withAdminAuth(request, async (_req, adminId) => {

    const userId = request.nextUrl.searchParams.get('id')
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      )
    }

    if (userId === adminId) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete yourself' },
        { status: 400 }
      )
    }

    await db.user.update({
      where: { id: userId },
      data: { is_active: false }
    })

    await db.auditLog.create({
      data: {
        user_id: adminId,
        action: 'DELETE',
        resource: 'user',
        resource_id: userId
      }
    })

    return NextResponse.json({ success: true })
  })
}
