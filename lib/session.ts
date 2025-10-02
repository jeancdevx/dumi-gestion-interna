import 'server-only'

import { cookies } from 'next/headers'

export interface SessionPayload {
  userId: string
  role: string
  email: string
  expiresAt: Date
}

/**
 * Decrypt session from cookie
 * In our case, SuperTokens handles encryption, we just decode the JWT payload
 */
export async function decrypt(
  session: string | undefined = ''
): Promise<SessionPayload | null> {
  if (!session) return null

  try {
    // JWT format: header.payload.signature
    const parts = session.split('.')
    if (parts.length !== 3) {
      console.warn('Invalid JWT format: incorrect number of parts')
      return null
    }

    // Decode the payload (base64url encoded)
    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString('utf-8')
    )

    // Check if token is expired
    const expiresAt = new Date(payload.exp * 1000)
    if (expiresAt < new Date()) {
      console.warn('Token expired:', expiresAt)
      return null
    }

    // SuperTokens stores roles in 'st-role' field with structure: { v: ['admin'], t: timestamp }
    const stRole = payload['st-role']
    const role = stRole?.v?.[0] // Get first role from array

    // Validate required fields
    if (!role || (!payload.userId && !payload.sub)) {
      console.warn('Missing required fields in token payload', {
        hasRole: !!role,
        hasUserId: !!(payload.userId || payload.sub),
        payload
      })
      return null
    }

    return {
      userId: payload.userId || payload.sub,
      role: role,
      email: payload.email,
      expiresAt
    }
  } catch (error) {
    console.error('Failed to decrypt session:', error)
    return null
  }
}

/**
 * Get session from cookie
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get('sAccessToken')?.value
  return decrypt(session)
}

/**
 * Delete session cookie (logout)
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('sAccessToken')
  cookieStore.delete('sRefreshToken')
  cookieStore.delete('sFrontToken')
}
