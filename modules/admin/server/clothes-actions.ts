'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

import { apiBaseUrl } from '@/db'

import { garmentSchema } from '@/modules/seller/schemas'

import { getGenderApiValue, getSizeApiValue } from '../helpers'
import { CreateClothesResponse } from '../types'

export const createClothesAction = async (formData: FormData) => {
  try {
    // Parse and validate form data
    const name = formData.get('name') as string
    const price = parseFloat(formData.get('price') as string)
    const descriptionRaw = formData.get('description') as string | null
    const description =
      descriptionRaw && descriptionRaw.trim()
        ? descriptionRaw.trim()
        : undefined

    // Parse images from FormData
    const images: File[] = []
    let imageIndex = 0
    while (formData.has(`image-${imageIndex}`)) {
      const file = formData.get(`image-${imageIndex}`) as File
      if (file && file.size > 0) {
        images.push(file)
      }
      imageIndex++
    }

    // Parse sizes from FormData
    const sizesRaw = formData.get('sizes') as string
    const sizes = sizesRaw ? JSON.parse(sizesRaw) : []

    // Prepare validation object
    const validationData: {
      name: string
      price: number
      description?: string
      images: File[]
      sizes: unknown[]
    } = {
      name,
      price,
      images,
      sizes
    }

    // Only add description if it exists and is not empty
    if (description) {
      validationData.description = description
    }

    // Validate with Zod
    const validatedData = garmentSchema.safeParse(validationData)

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
      name: string
      description?: string
      price: number
      variants: Array<{
        gender: string
        size: string
        additional: number
      }>
      images: Array<{
        filename: string
        contentType: string
      }>
    } = {
      name: validatedData.data.name,
      price: validatedData.data.price,
      variants: validatedData.data.sizes.map(size => ({
        gender: getGenderApiValue(size.gender),
        size: getSizeApiValue(size.size),
        additional: 0
      })),
      images: validatedData.data.images.map(file => ({
        filename: file.name,
        contentType: file.type
      }))
    }

    if (
      validatedData.data.description &&
      validatedData.data.description.trim() !== ''
    ) {
      body.description = validatedData.data.description.trim()
    }

    console.log('Request body:', JSON.stringify(body, null, 2))
    console.log('Description value:', validatedData.data.description)
    console.log(
      'Description in body:',
      'description' in body ? body.description : 'NOT IN BODY'
    )

    // Create clothes and get pre-signed URLs
    const response = await fetch(`${apiBaseUrl}/v1/clothes`, {
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
      console.error('Error creating clothes:', errorData)
      return {
        success: false as const,
        message:
          errorData.message ||
          'Error al crear la prenda. Por favor, intenta de nuevo.'
      }
    }

    const clothesData: CreateClothesResponse = await response.json()

    const uploadPromises = clothesData.preSignedPuts.map(
      async (preSignedPut, index) => {
        const file = validatedData.data.images[index]
        if (!file) return null

        try {
          const uploadResponse = await fetch(preSignedPut.putUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': preSignedPut.requiredHeaders['Content-Type']
            },
            body: file
          })

          if (!uploadResponse.ok) {
            console.error(
              `Error uploading image ${index}:`,
              uploadResponse.statusText
            )
            return null
          }

          return { success: true, key: preSignedPut.key }
        } catch (error) {
          console.error(`Error uploading image ${index}:`, error)
          return null
        }
      }
    )

    const uploadResults = await Promise.all(uploadPromises)
    const failedUploads = uploadResults.filter(result => result === null)

    if (failedUploads.length > 0) {
      console.warn(
        `${failedUploads.length} images failed to upload, but clothes was created`
      )
    }

    revalidatePath('/admin/clothes')
    revalidatePath('/seller/clothes')

    return {
      success: true as const,
      data: {
        id: clothesData.id,
        name: clothesData.name,
        price: clothesData.price,
        imagesUploaded: uploadResults.filter(r => r !== null).length,
        totalImages: validatedData.data.images.length
      },
      message: 'Prenda creada exitosamente'
    }
  } catch (error) {
    console.error('Error in createClothesAction:', error)
    return {
      success: false as const,
      message: 'Ocurrió un error inesperado. Por favor, intenta de nuevo.'
    }
  }
}
