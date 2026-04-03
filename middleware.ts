import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SUBDOMAIN_MAP: Record<string, string> = {
  opensource: 'opensource',
  webdev: 'webdev',
  aiml: 'aiml',
  aiconic: 'aiml',
  launchpad: 'launchpad',
  cp: 'cp',
  cybersec: 'cybersec',
  security: 'cybersec',
}

const DEFAULT_COHORT = 'opensource'

function getCohortSlug(request: NextRequest): string {
  // 1. Check query param (for local dev: ?cohort=webdev)
  const cohortParam = new URL(request.url).searchParams.get('cohort')
  if (cohortParam && SUBDOMAIN_MAP[cohortParam]) {
    return SUBDOMAIN_MAP[cohortParam]
  }

  // 2. Check subdomain
  const hostname = request.headers.get('host') || ''
  const parts = hostname.split('.')
  if (parts.length >= 3) {
    const subdomain = parts[0].toLowerCase()
    if (SUBDOMAIN_MAP[subdomain]) {
      return SUBDOMAIN_MAP[subdomain]
    }
  }

  return DEFAULT_COHORT
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = new URL(request.url)
  const response = NextResponse.next()

  // 1. Inject cohort slug into request headers (readable by server components)
  const cohortSlug = getCohortSlug(request)
  response.headers.set('x-cohort-slug', cohortSlug)

  // Also set as a cookie so client components can access it
  response.cookies.set('cohort_slug', cohortSlug, {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 1 day
  })

  // 2. Referral Capture
  const referralCode = searchParams.get('ref')
  if (referralCode) {
    response.cookies.set('referral_code', referralCode, {
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    })
    // Client-readable mirror for referral banner UI
    response.cookies.set('ref_display', referralCode, {
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
    })
  }

  // 3. Admin Route Protection
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const adminToken = request.cookies.get('admin_token')?.value
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // 4. User Dashboard Protection
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
