import 'server-only'

import { cache } from 'react'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { decrypt } from './session'

/**
 * User roles for internal management system
 * Note: 'customer' role is handled in the separate e-commerce project
 */
export type UserRole = 'admin' | 'seller'

/**
 * User data structure from the API
 */
export interface User {
  id: string
  superTokensId: string
  names: string
  lastNames: string
  email: string
  roles: UserRole[]
  createdAt: string
  updatedAt: string
}

/**
 * Verify that the user is authenticated
 * This function is cached per request using React's cache
 * @returns Session data or redirects to /sign-in
 */
export const verifySession = cache(async () => {
  const cookieStore = await cookies()
  const session = cookieStore.get('sAccessToken')?.value
  const sessionData = await decrypt(session)

  if (!sessionData?.userId) {
    // Note: Cannot delete cookies here as this is called from Server Components
    // Cookie cleanup is handled by middleware instead
    redirect('/sign-in')
  }

  return {
    isAuth: true,
    userId: sessionData.userId,
    role: sessionData.role as UserRole,
    email: sessionData.email
  }
})

/**
 * Get user data from the API
 * This function is cached per request
 */
export const getUser = cache(async (): Promise<User | null> => {
  const session = await verifySession()

  if (!session) return null

  try {
    const cookieStore = await cookies()

    // Get all SuperTokens cookies
    const accessToken = cookieStore.get('sAccessToken')?.value
    const refreshToken = cookieStore.get('sRefreshToken')?.value
    const frontToken = cookieStore.get('sFrontToken')?.value
    const antiCsrf =
      cookieStore.get('anti-csrf')?.value || cookieStore.get('sAntiCsrf')?.value

    if (!accessToken || !refreshToken || !frontToken) {
      console.error('Missing required cookies for API call')
      return null
    }

    // Build cookie header with all SuperTokens cookies
    const cookieHeader = [
      `sAccessToken=${accessToken}`,
      `sRefreshToken=${refreshToken}`,
      `sFrontToken=${frontToken}`
    ].join('; ')

    const headers: HeadersInit = {
      Cookie: cookieHeader
    }

    // Add anti-csrf header if available (some endpoints may require it)
    if (antiCsrf) {
      headers['anti-csrf'] = antiCsrf
    }

    const response = await fetch(
      'https://dumi-dev.onrender.com/api/v1/employees/me',
      {
        headers,
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      console.error('Failed to fetch user data:', response.status)
      return null
    }

    const userData = await response.json()

    return {
      id: userData.id,
      superTokensId: userData.superTokensId,
      names: userData.names,
      lastNames: userData.lastNames,
      email: userData.email,
      roles: userData.roles as UserRole[],
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt
    }
  } catch (error) {
    console.error('Failed to fetch user:', error)
    return null
  }
})

/**
 * Get user role from session
 * This function is cached per request
 */
export const getUserRole = cache(async (): Promise<UserRole | null> => {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('sAccessToken')?.value
    const sessionData = await decrypt(session)

    if (!sessionData?.role) {
      return null
    }

    return sessionData.role as UserRole
  } catch (error) {
    console.error('Failed to get user role:', error)
    return null
  }
})

/**
 * Check if user has a specific role
 * Redirects to /sign-in if not authenticated
 * Redirects to home if wrong role
 */
export async function requireRole(requiredRole: UserRole): Promise<void> {
  const session = await verifySession() // This redirects if not authenticated

  if (session.role !== requiredRole) {
    // Redirect to their dashboard
    redirect(getRedirectPathByRole(session.role))
  }
}

/**
 * Check if user has any of the allowed roles
 * Redirects to /sign-in if not authenticated
 * Redirects to home if no matching role
 */
export async function requireAnyRole(allowedRoles: UserRole[]): Promise<void> {
  const session = await verifySession() // This redirects if not authenticated

  if (!allowedRoles.includes(session.role)) {
    // Redirect to their dashboard
    redirect(getRedirectPathByRole(session.role))
  }
}

/**
 * Get redirect path based on user role
 * Internal management system only handles admin and seller roles
 */
export function getRedirectPathByRole(role: UserRole): string {
  const roleRedirects: Record<UserRole, string> = {
    admin: '/admin',
    seller: '/seller'
  }

  return roleRedirects[role] || '/admin'
}

/**
 * Check if user is authenticated without redirecting
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get('sAccessToken')?.value
  const sessionData = await decrypt(session)
  return !!sessionData?.userId
}

/**
 * Redirect authenticated users to their dashboard
 * Use this in auth pages (sign-in, sign-up) to prevent logged-in users from accessing them
 */
export async function redirectIfAuthenticated(): Promise<void> {
  const cookieStore = await cookies()
  const session = cookieStore.get('sAccessToken')?.value
  const sessionData = await decrypt(session)

  if (sessionData?.userId && sessionData?.role) {
    const redirectPath = getRedirectPathByRole(sessionData.role as UserRole)
    redirect(redirectPath)
  }
}
