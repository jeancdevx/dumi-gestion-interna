'use server'

import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'

import { apiBaseUrl } from '@/db'

import { createOrderSchema } from '../schemas'
import { Order } from '../types'

export const createOrderAction = async (formData: FormData) => {
  try {
    // Parse form data
    const quoteId = formData.get('quoteId') as string
    const deliveryDateStr = formData.get('deliveryDate') as string
    const department = formData.get('department') as string
    const city = formData.get('city') as string
    const district = formData.get('district') as string
    const street = formData.get('street') as string

    // Parse delivery date
    const deliveryDate = deliveryDateStr ? new Date(deliveryDateStr) : null

    if (!deliveryDate) {
      return {
        success: false as const,
        message: 'Fecha de entrega inválida'
      }
    }

    // Validate with Zod
    const validatedData = createOrderSchema.safeParse({
      quoteId,
      deliveryDate,
      department,
      city,
      district,
      street
    })

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

    // Create order
    const response = await fetch(`${apiBaseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `sAccessToken=${accessToken}; sRefreshToken=${refreshToken}; sFrontToken=${frontToken}`,
        'anti-csrf': antiCsrf
      },
      body: JSON.stringify({
        quoteId: validatedData.data.quoteId,
        deliveryDate: validatedData.data.deliveryDate.toISOString(),
        address: {
          department: validatedData.data.department,
          city: validatedData.data.city,
          district: validatedData.data.district,
          street: validatedData.data.street
        }
      }),
      cache: 'no-store'
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Error creating order:', errorData)
      return {
        success: false as const,
        message:
          errorData.message ||
          'Error al crear la orden. Por favor, intenta de nuevo.'
      }
    }

    const order: Order = await response.json()

    // Revalidate cache
    revalidateTag('orders')
    revalidateTag('quotes') // También revalidamos quotes porque el estado cambió

    return {
      success: true as const,
      data: order,
      message: 'Orden creada exitosamente'
    }
  } catch (error) {
    console.error('Error in createOrderAction:', error)
    return {
      success: false as const,
      message: 'Ocurrió un error inesperado. Por favor, intenta de nuevo.'
    }
  }
}
