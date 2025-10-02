import { NextRequest, NextResponse } from 'next/server'

import { decrypt } from '@/lib/session'

const protectedRoutes = ['/admin', '/seller']

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  try {
    const cookie = req.cookies.get('sAccessToken')?.value
    const session = await decrypt(cookie)

    if (!session?.userId) {
      const response = NextResponse.redirect(new URL('/sign-in', req.url))
      response.cookies.delete('sAccessToken')
      response.cookies.delete('sRefreshToken')
      response.cookies.delete('sFrontToken')
      return response
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    const response = NextResponse.redirect(new URL('/sign-in', req.url))
    response.cookies.delete('sAccessToken')
    response.cookies.delete('sRefreshToken')
    response.cookies.delete('sFrontToken')
    return response
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
}
