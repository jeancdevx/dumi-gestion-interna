'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'

import { apiBaseUrl } from '@/db'

import { createQuoteSchema } from '../schemas'
import { Quote } from '../types'

export const createQuoteAction = async (formData: FormData) => {
  try {
    const detailsRaw = formData.get('details') as string
    const customerId = formData.get('customerId') as string

    if (!detailsRaw || !customerId) {
      return {
        success: false as const,
        message: 'Datos incompletos'
      }
    }

    const details = JSON.parse(detailsRaw)

    const validatedData = createQuoteSchema.safeParse({
      details,
      customerId
    })

    if (!validatedData.success) {
      return {
        success: false as const,
        errors: validatedData.error.flatten().fieldErrors,
        message: 'Por favor, verifica los datos ingresados.'
      }
    }

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

    const response = await fetch(`${apiBaseUrl}/quotes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `sAccessToken=${accessToken}; sRefreshToken=${refreshToken}; sFrontToken=${frontToken}`,
        'anti-csrf': antiCsrf
      },
      body: JSON.stringify(validatedData.data)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Error creating quote:', errorData)
      return {
        success: false as const,
        message:
          errorData.message ||
          'Error al crear la cotización. Por favor, intenta de nuevo.'
      }
    }

    const quoteData: Quote = await response.json()

    revalidateTag('quotes')
    revalidatePath('/admin/quotes')
    revalidatePath('/seller/quotes')

    return {
      success: true as const,
      data: quoteData,
      message: 'Cotización creada exitosamente'
    }
  } catch (error) {
    console.error('Error in createQuoteAction:', error)
    return {
      success: false as const,
      message: 'Ocurrió un error inesperado. Por favor, intenta de nuevo.'
    }
  }
}
