'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'

import { apiBaseUrl } from '@/db'

import { customerSchema } from '../schemas'

export const createCustomerAction = async (formData: FormData) => {
  try {
    // Parse and validate form data
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const phone = formData.get('phone') as string
    const referenceRaw = formData.get('reference') as string | null
    const reference =
      referenceRaw && referenceRaw.trim() ? referenceRaw.trim() : undefined

    // Prepare validation object
    const validationData: {
      firstName: string
      lastName: string
      phone: string
      reference?: string
    } = {
      firstName,
      lastName,
      phone
    }

    // Only add reference if it exists and is not empty
    if (reference) {
      validationData.reference = reference
    }

    // Validate with Zod
    const validatedData = customerSchema.safeParse(validationData)

    if (!validatedData.success) {
      return {
        success: false as const,
        errors: validatedData.error.flatten().fieldErrors,
        message: 'Por favor, verifica los datos ingresados.'
      }
    }

    // Get auth cookies
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('sAccessToken')?.value
    const refreshToken = cookieStore.get('sRefreshToken')?.value
    const frontToken = cookieStore.get('sFrontToken')?.value
    const antiCsrf =
      cookieStore.get('sAntiCsrf')?.value || cookieStore.get('anti-csrf')?.value

    if (!accessToken || !antiCsrf) {
      return {
        success: false as const,
        message: 'No estás autenticado. Por favor, inicia sesión.'
      }
    }

    // Prepare request body
    const body: {
      names: string
      lastNames: string
      phone: string
      reference?: string
    } = {
      names: validatedData.data.firstName,
      lastNames: validatedData.data.lastName,
      phone: validatedData.data.phone
    }

    // Only add reference if it exists and is not empty
    if (
      validatedData.data.reference &&
      validatedData.data.reference.trim() !== ''
    ) {
      body.reference = validatedData.data.reference.trim()
    }

    // Create customer
    const response = await fetch(`${apiBaseUrl}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `sAccessToken=${accessToken}; sRefreshToken=${refreshToken}; sFrontToken=${frontToken}`,
        'anti-csrf': antiCsrf
      },
      body: JSON.stringify(body),
      cache: 'no-store'
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Error creating customer:', errorData)
      return {
        success: false as const,
        message:
          errorData.message ||
          'Error al crear el cliente. Por favor, intenta de nuevo.'
      }
    }

    const customerData = await response.json()

    // Invalidar caché
    revalidateTag('customers')
    revalidatePath('/admin/customers')
    revalidatePath('/seller/customers')

    return {
      success: true as const,
      data: customerData,
      message: 'Cliente creado exitosamente'
    }
  } catch (error) {
    console.error('Error in createCustomerAction:', error)
    return {
      success: false as const,
      message: 'Ocurrió un error inesperado. Por favor, intenta de nuevo.'
    }
  }
}
