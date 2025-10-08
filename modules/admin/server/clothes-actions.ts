'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

import { garmentSchema } from '@/modules/seller/schemas'

interface ClothesVariant {
  clothesId: string
  sizeId: string
  genderId: string
  additional: number
  id: string
}

interface PreSignedPut {
  key: string
  putUrl: string
  expiresAt: string
  requiredHeaders: {
    'Content-Type': string
  }
}

interface CreateClothesResponse {
  name: string
  description: string
  price: number
  id: string
  createdAt: string
  updatedAt: string
  variants: ClothesVariant[]
  preSignedPuts: PreSignedPut[]
}

// Enums from backend
export enum CLOTHES_SIZES {
  TALLA_2 = '2',
  TALLA_4 = '4',
  TALLA_6 = '6',
  TALLA_8 = '8',
  TALLA_10 = '10',
  TALLA_12 = '12',
  TALLA_14 = '14',
  TALLA_16 = '16',
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
  XXXL = 'XXXL'
}

export enum CLOTHES_GENDER {
  MALE = 'HOMBRE',
  FEMALE = 'MUJER',
  UNISEX = 'UNISEX'
}

// Helper to map size names to API format (now returns the enum value directly)
const getSizeApiValue = (sizeName: string): string => {
  // Just return the size as-is since it matches the enum values
  return sizeName
}

// Helper to map gender to API format (uppercase)
const getGenderApiValue = (genderName: string): string => {
  const genderMap: Record<string, string> = {
    hombre: CLOTHES_GENDER.MALE,
    mujer: CLOTHES_GENDER.FEMALE,
    unisex: CLOTHES_GENDER.UNISEX
  }
  return genderMap[genderName] || CLOTHES_GENDER.UNISEX
}

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

    // Only add description if it exists and is not empty
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
    const response = await fetch(
      'https://dumi-dev.onrender.com/api/v1/clothes',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `sAccessToken=${accessToken}; sRefreshToken=${refreshToken}; sFrontToken=${frontToken}`,
          'anti-csrf': antiCsrf
        },
        body: JSON.stringify(body),
        cache: 'no-store'
      }
    )

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

    // Upload images to Cloudflare R2 using pre-signed URLs
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

    // Revalidate paths
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
