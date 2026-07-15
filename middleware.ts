import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET)

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value
  const isLoginPage = req.nextUrl.pathname === '/admin/login'

  let isValid = false
  if (token) {
    try {
      await jwtVerify(token, SECRET)
      isValid = true
    } catch {
      isValid = false
    }
  }

  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!isValid && !isLoginPage) {
      const res = NextResponse.redirect(new URL('/admin/login', req.url))
      res.cookies.delete('admin_session')
      return res
    }
    if (isValid && isLoginPage) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
  }
  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*'] }
