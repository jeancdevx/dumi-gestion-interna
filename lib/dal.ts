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
 * Get user data (you can extend this to fetch from database)
 * This function is cached per request
 */
export const getUser = cache(async () => {
  const session = await verifySession()

  if (!session) return null

  try {
    // Here you would fetch user data from your database
    // For now, we return what we have in the session
    return {
      id: session.userId,
      email: session.email,
      role: session.role
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
