'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'

import { apiBaseUrl } from '@/db'

import { employeeSchema, updateEmployeeSchema } from '../schemas'
import { CreateEmployeeResponse, UpdateEmployeeResponse } from '../types'

export const createEmployeeAction = async (formData: FormData) => {
  const validatedData = employeeSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    password: formData.get('password')
  })

  if (!validatedData.success) {
    return {
      success: false as const,
      errors: validatedData.error.flatten().fieldErrors,
      message: 'Por favor, verifica los datos ingresados.'
    }
  }

  // Get auth cookies to authenticate the request
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('sAccessToken')?.value
  const refreshToken = cookieStore.get('sRefreshToken')?.value
  const frontToken = cookieStore.get('sFrontToken')?.value

  // Try different possible anti-csrf cookie names
  const antiCsrf =
    cookieStore.get('sAntiCsrf')?.value ||
    cookieStore.get('anti-csrf')?.value ||
    cookieStore.get('st-anti-csrf')?.value

  if (!accessToken) {
    return {
      success: false as const,
      message: 'No estás autenticado. Por favor, inicia sesión.'
    }
  }

  // Check if critical cookies are missing
  if (!refreshToken || !frontToken) {
    console.error('Missing critical SuperTokens cookies')
    return {
      success: false as const,
      message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
    }
  }

  let response: Response
  let result: CreateEmployeeResponse

  try {
    // Build cookie string only with available cookies
    const cookieParts = [`sAccessToken=${accessToken}`]
    if (refreshToken) cookieParts.push(`sRefreshToken=${refreshToken}`)
    if (frontToken) cookieParts.push(`sFrontToken=${frontToken}`)

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Cookie: cookieParts.join('; ')
    }

    if (antiCsrf) {
      headers['anti-csrf'] = antiCsrf
    }

    response = await fetch(`${apiBaseUrl}/admin/employees`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email: validatedData.data.email,
        names: validatedData.data.firstName,
        lastNames: validatedData.data.lastName,
        password: validatedData.data.password
      })
    })

    result = await response.json()
  } catch (error) {
    console.error('Network error creating employee:', error)
    return {
      success: false as const,
      message: 'Error de conexión. Por favor, verifica tu conexión a internet.'
    }
  }

  // Check for successful creation (201) or update (200)
  if (!response.ok) {
    // Check if it's an email conflict error (usually 409)
    if (response.status === 409 || result.message?.includes('email')) {
      return {
        success: false as const,
        message: 'Este email ya está registrado.'
      }
    }

    return {
      success: false as const,
      message: 'No se pudo crear el empleado. Por favor, intenta de nuevo.'
    }
  }

  // Invalidar caché
  revalidateTag('employees')
  revalidatePath('/admin/employees')

  return {
    success: true as const,
    message: 'Empleado creado exitosamente.',
    data: result
  }
}

export const updateEmployeeAction = async (formData: FormData) => {
  const validatedData = updateEmployeeSchema.safeParse({
    id: formData.get('id'),
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    password: formData.get('password')
  })

  if (!validatedData.success) {
    return {
      success: false as const,
      errors: validatedData.error.flatten().fieldErrors,
      message: 'Por favor, verifica los datos ingresados.'
    }
  }

  // Get auth cookies to authenticate the request
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('sAccessToken')?.value
  const refreshToken = cookieStore.get('sRefreshToken')?.value
  const frontToken = cookieStore.get('sFrontToken')?.value

  // Try different possible anti-csrf cookie names
  const antiCsrf =
    cookieStore.get('sAntiCsrf')?.value ||
    cookieStore.get('anti-csrf')?.value ||
    cookieStore.get('st-anti-csrf')?.value

  if (!accessToken) {
    return {
      success: false as const,
      message: 'No estás autenticado. Por favor, inicia sesión.'
    }
  }

  // Check if critical cookies are missing
  if (!refreshToken || !frontToken) {
    console.error('Missing critical SuperTokens cookies for update')
    return {
      success: false as const,
      message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
    }
  }

  let response: Response
  let result: UpdateEmployeeResponse

  try {
    // Build cookie string only with available cookies
    const cookieParts = [`sAccessToken=${accessToken}`]
    if (refreshToken) cookieParts.push(`sRefreshToken=${refreshToken}`)
    if (frontToken) cookieParts.push(`sFrontToken=${frontToken}`)

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Cookie: cookieParts.join('; ')
    }

    if (antiCsrf) {
      headers['anti-csrf'] = antiCsrf
    }

    response = await fetch(
      `${apiBaseUrl}/admin/employees/${validatedData.data.id}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          email: validatedData.data.email,
          names: validatedData.data.firstName,
          lastNames: validatedData.data.lastName,
          password: validatedData.data.password
        })
      }
    )

    result = await response.json()
  } catch (error) {
    console.error('Network error updating employee:', error)
    return {
      success: false as const,
      message: 'Error de conexión. Por favor, verifica tu conexión a internet.'
    }
  }

  // Check for successful update (200)
  if (!response.ok) {
    // Check if it's an email conflict error (usually 409)
    if (response.status === 409 || result.message?.includes('email')) {
      return {
        success: false as const,
        message: 'Este email ya está registrado.'
      }
    }

    return {
      success: false as const,
      message: 'No se pudo actualizar el empleado. Por favor, intenta de nuevo.'
    }
  }

  // Invalidar caché
  revalidateTag('employees')
  revalidatePath('/admin/employees')

  return {
    success: true as const,
    message: 'Empleado actualizado exitosamente.',
    data: result
  }
}
