'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getRedirectPathByRole, getUserRole } from '@/lib/dal'

import { signInSchema } from '../schemas'

type SignInResponse = {
  status: string
  user?: {
    id: string
    email: string
    timeJoined: number
  }
}

export const signInAction = async (formData: FormData) => {
  const validatedData = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password')
  })

  if (!validatedData.success) {
    return {
      success: false as const,
      errors: validatedData.error.flatten().fieldErrors,
      message: 'Validation failed'
    }
  }

  let response: Response
  let result: SignInResponse

  try {
    response = await fetch('https://dumi-dev.onrender.com/api/v1/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        rid: 'emailpassword'
      },
      credentials: 'include',
      body: JSON.stringify({
        formFields: [
          { id: 'email', value: validatedData.data.email },
          { id: 'password', value: validatedData.data.password }
        ]
      })
    })

    result = await response.json()
  } catch (error) {
    console.error('Network error:', error)
    return {
      success: false as const,
      message: 'Error de conexión. Por favor, verifica tu conexión a internet.'
    }
  }

  if (!response.ok || result.status !== 'OK') {
    return {
      success: false as const,
      message: 'Credenciales inválidas. Por favor, intenta de nuevo.'
    }
  }

  const setCookieHeaders = response.headers.getSetCookie()

  // Extract anti-csrf from response headers (not from cookies)
  const antiCsrfFromHeader = response.headers.get('anti-csrf')
  const frontTokenFromHeader = response.headers.get('front-token')

  if (setCookieHeaders && setCookieHeaders.length > 0) {
    const cookieStore = await cookies()

    setCookieHeaders.forEach(cookieString => {
      const [cookiePart, ...attributesParts] = cookieString.split(';')
      const [name, value] = cookiePart.trim().split('=')

      const attributes: {
        httpOnly?: boolean
        secure?: boolean
        sameSite?: 'strict' | 'lax' | 'none'
        path?: string
        maxAge?: number
      } = {}

      attributesParts.forEach(attr => {
        const trimmedAttr = attr.trim()
        if (trimmedAttr.toLowerCase() === 'httponly') {
          attributes.httpOnly = true
        } else if (trimmedAttr.toLowerCase() === 'secure') {
          attributes.secure = true
        } else if (trimmedAttr.toLowerCase().startsWith('samesite=')) {
          const sameSiteValue = trimmedAttr.split('=')[1].toLowerCase()
          if (
            sameSiteValue === 'strict' ||
            sameSiteValue === 'lax' ||
            sameSiteValue === 'none'
          ) {
            attributes.sameSite = sameSiteValue
          }
        } else if (trimmedAttr.toLowerCase().startsWith('path=')) {
          attributes.path = '/'
        } else if (trimmedAttr.toLowerCase().startsWith('max-age=')) {
          attributes.maxAge = parseInt(trimmedAttr.split('=')[1])
        } else if (trimmedAttr.toLowerCase().startsWith('expires=')) {
        }
      })

      attributes.path = '/'

      cookieStore.set(name, value, attributes)
    })

    if (antiCsrfFromHeader) {
      cookieStore.set('anti-csrf', antiCsrfFromHeader, {
        path: '/',
        httpOnly: false,
        sameSite: 'lax'
      })
    }

    if (frontTokenFromHeader) {
      cookieStore.set('sFrontToken', frontTokenFromHeader, {
        path: '/',
        httpOnly: false,
        sameSite: 'lax'
      })
    }
  }

  const userRole = await getUserRole()

  if (!userRole) {
    return {
      success: false as const,
      message: 'No se pudo determinar el rol del usuario.'
    }
  }

  const redirectPath = getRedirectPathByRole(userRole)

  redirect(redirectPath)
}
