'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

import { newEmployeeSchema, updateEmployeeSchema } from '../schemas'

type CreateEmployeeResponse = {
  status: string
  user?: {
    id: string
    email: string
    timeJoined: number
  }
}

type UpdateEmployeeResponse = {
  status: string
  user?: {
    id: string
    email: string
    timeJoined: number
  }
}

export const createEmployeeAction = async (formData: FormData) => {
  const validatedData = newEmployeeSchema.safeParse({
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

  if (!accessToken) {
    return {
      success: false as const,
      message: 'No estás autenticado. Por favor, inicia sesión.'
    }
  }

  let response: Response
  let result: CreateEmployeeResponse

  try {
    response = await fetch(
      'https://dumi-dev.onrender.com/api/v1/admin/employees',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `sAccessToken=${accessToken}; sRefreshToken=${refreshToken}; sFrontToken=${frontToken}`
        },
        body: JSON.stringify({
          email: validatedData.data.email,
          names: validatedData.data.firstName,
          lastNames: validatedData.data.lastName,
          password: validatedData.data.password
        })
      }
    )

    result = await response.json()

    console.log('Create Employee Response Status:', response.status)
    console.log('Create Employee Response:', result)
  } catch (error) {
    console.error('Network error creating employee:', error)
    return {
      success: false as const,
      message: 'Error de conexión. Por favor, verifica tu conexión a internet.'
    }
  }

  if (!response.ok || result.status !== 'OK') {
    const errorMessage =
      result.status === 'EMAIL_ALREADY_EXISTS_ERROR'
        ? 'Este email ya está registrado.'
        : 'No se pudo crear el empleado. Por favor, intenta de nuevo.'

    return {
      success: false as const,
      message: errorMessage
    }
  }

  revalidatePath('/admin/employees')

  return {
    success: true as const,
    message: 'Empleado creado exitosamente.',
    data: result.user
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

  if (!accessToken) {
    return {
      success: false as const,
      message: 'No estás autenticado. Por favor, inicia sesión.'
    }
  }

  let response: Response
  let result: UpdateEmployeeResponse

  try {
    response = await fetch(
      `https://dumi-dev.onrender.com/api/v1/admin/employees/${validatedData.data.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `sAccessToken=${accessToken}; sRefreshToken=${refreshToken}; sFrontToken=${frontToken}`
        },
        body: JSON.stringify({
          email: validatedData.data.email,
          names: validatedData.data.firstName,
          lastNames: validatedData.data.lastName,
          password: validatedData.data.password
        })
      }
    )

    result = await response.json()

    console.log('Update Employee Response Status:', response.status)
    console.log('Update Employee Response:', result)
  } catch (error) {
    console.error('Network error updating employee:', error)
    return {
      success: false as const,
      message: 'Error de conexión. Por favor, verifica tu conexión a internet.'
    }
  }

  if (!response.ok || result.status !== 'OK') {
    const errorMessage =
      result.status === 'EMAIL_ALREADY_EXISTS_ERROR'
        ? 'Este email ya está registrado.'
        : 'No se pudo actualizar el empleado. Por favor, intenta de nuevo.'

    return {
      success: false as const,
      message: errorMessage
    }
  }

  revalidatePath('/admin/employees')

  return {
    success: true as const,
    message: 'Empleado actualizado exitosamente.',
    data: result.user
  }
}
