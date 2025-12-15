import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) {
    const userCookie = request.cookies.get('masai_user')

    if (!userCookie) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    try {
      const user = JSON.parse(userCookie.value)

      if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

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
