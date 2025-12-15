import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware untuk API routes dan public routes
  if (pathname.startsWith('/api/') || pathname === '/') {
    return NextResponse.next()
  }

  // Proteksi route admin
  if (pathname.startsWith('/admin')) {
    const userCookie = request.cookies.get('masai_user')

    if (!userCookie) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    try {
      const user = JSON.parse(userCookie.value)

      if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
        // Jika bukan admin, redirect ke dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Proteksi route dashboard (untuk semua user yang login)
  if (pathname.startsWith('/dashboard')) {
    const userCookie = request.cookies.get('masai_user')
    
    if (!userCookie) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*']
}