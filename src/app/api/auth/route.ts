import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { generateToken } from '@/lib/auth'

/* ======================================================
   POST /api/auth/login - Login User
====================================================== */
export async function POST(request: NextRequest) {
  try {
    const { action, email, password, name, phone } = await request.json()

    if (action === 'login') {
      // ===== LOGIN =====
      if (!email || !password) {
        return NextResponse.json(
          { success: false, error: 'Email dan password harus diisi' },
          { status: 400 }
        )
      }

      // Find user
      const user = await db.user.findUnique({
        where: { email }
      })

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Email atau password salah' },
          { status: 401 }
        )
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password_hash)
      if (!validPassword) {
        return NextResponse.json(
          { success: false, error: 'Email atau password salah' },
          { status: 401 }
        )
      }

      if (!user.is_active) {
        return NextResponse.json(
          { success: false, error: 'Akun tidak aktif' },
          { status: 403 }
        )
      }

      // Update last login
      await db.user.update({
        where: { id: user.id },
        data: { last_login: new Date() }
      })

      // Create audit log
      await db.auditLog.create({
        data: {
          user_id: user.id,
          action: 'LOGIN',
          resource: 'user',
          resource_id: user.id,
          ip_address: request.headers.get('x-forwarded-for') || 'unknown'
        }
      })

      // Generate token
      const token = await generateToken({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role as any
      })

      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role
      }

      return NextResponse.json({
        success: true,
        user: userData,
        token
      })

    } else if (action === 'register') {
      // ===== REGISTER =====
      if (!email || !password || !name) {
        return NextResponse.json(
          { success: false, error: 'Email, password, dan nama harus diisi' },
          { status: 400 }
        )
      }

      // Check if user exists
      const existingUser = await db.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'Email sudah terdaftar' },
          { status: 409 }
        )
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create user
      const newUser = await db.user.create({
        data: {
          email,
          name,
          phone: phone || null,
          password_hash: hashedPassword,
          role: 'USER',
          is_active: true
        }
      })

      // Create audit log
      await db.auditLog.create({
        data: {
          user_id: newUser.id,
          action: 'CREATE',
          resource: 'user',
          resource_id: newUser.id,
          new_values: JSON.stringify({ email, name }),
          ip_address: request.headers.get('x-forwarded-for') || 'unknown'
        }
      })

      // Generate token
      const token = await generateToken({
        userId: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role as any
      })

      const userData = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone,
        role: newUser.role
      }

      return NextResponse.json({
        success: true,
        user: userData,
        token
      })

    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Auth API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/* ======================================================
   DELETE /api/auth/logout - Logout User
====================================================== */
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (authHeader) {
      // Extract user info from token if available
      // For now, just log the logout
      console.log('User logged out')
    }

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}