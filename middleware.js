import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  const url = new URL(req.url)
  const path = url.pathname

  // 1. Dashboard Protection (Requires any auth)
  if (path.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL(`/auth/login?redirect=${path}`, req.url))
    }
  }

  // 2. Admin Protection (Requires auth + role='admin')
  if (path.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL(`/auth/login?redirect=${path}`, req.url))
    }

    // Fetch user profile role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  // 3. Auth Redirection (If logged in, don't show login/signup)
  if (path.startsWith('/auth/login') || path.startsWith('/auth/signup')) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/auth/:path*'],
}
