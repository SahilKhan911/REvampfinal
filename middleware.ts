import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = new URL(request.url)
  const response = NextResponse.next()

  // 1. Referral Capture
  const referralCode = searchParams.get('ref')
  if (referralCode) {
    response.cookies.set('referral_code', referralCode, {
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    })
  }

  // 2. Admin Route Protection
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const adminToken = request.cookies.get('admin_token')?.value
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // 3. User Dashboard Protection
  if (pathname.startsWith('/dashboard')) {
    const userToken = request.cookies.get('user_token')?.value
    if (!userToken) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
