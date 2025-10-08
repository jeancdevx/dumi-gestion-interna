'use server'

import { revalidatePath } from 'next/cache'

import { garmentSchema, updateGarmentSchema } from '../schemas'

type CreateGarmentResponse = {
  status?: string
  message?: string
  id?: string
  name?: string
  price?: number
  // TODO: Add more fields when backend is ready
}

type UpdateGarmentResponse = CreateGarmentResponse

export const createGarmentAction = async (formData: FormData) => {
  // Validate form data
  const validatedData = garmentSchema.safeParse({
    name: formData.get('name'),
    price: parseFloat(formData.get('price') as string),
    description: formData.get('description') || undefined,
    images: [], // TODO: Handle images from FormData
    sizes: [] // TODO: Handle sizes from FormData
  })

  if (!validatedData.success) {
    return {
      success: false as const,
      errors: validatedData.error.flatten().fieldErrors,
      message: 'Por favor, verifica los datos ingresados.'
    }
  }

  try {
    // TODO: Implement Cloudflare R2 upload for images
    console.log('TODO: Upload images to Cloudflare R2')

    // TODO: Implement API call to create garment
    console.log('TODO: Create garment via API')
    console.log('Validated data:', validatedData.data)

    // Simulate API response
    const response: CreateGarmentResponse = {
      status: 'success',
      message: 'Prenda creada exitosamente',
      id: 'temp-id',
      name: validatedData.data.name,
      price: validatedData.data.price
    }

    // Revalidate the clothes page
    revalidatePath('/seller/clothes')

    return {
      success: true as const,
      data: response,
      message: 'Prenda creada exitosamente'
    }
  } catch (error) {
    console.error('Error creating garment:', error)
    return {
      success: false as const,
      message:
        'Ocurrió un error al crear la prenda. Por favor, intenta de nuevo.'
    }
  }
}

export const updateGarmentAction = async (formData: FormData) => {
  // Validate form data
  const validatedData = updateGarmentSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    price: parseFloat(formData.get('price') as string),
    description: formData.get('description') || undefined,
    images: [], // TODO: Handle images from FormData
    sizes: [] // TODO: Handle sizes from FormData
  })

  if (!validatedData.success) {
    return {
      success: false as const,
      errors: validatedData.error.flatten().fieldErrors,
      message: 'Por favor, verifica los datos ingresados.'
    }
  }

  try {
    // TODO: Implement Cloudflare R2 upload for images
    console.log('TODO: Upload images to Cloudflare R2')

    // TODO: Implement API call to update garment
    console.log('TODO: Update garment via API')
    console.log('Validated data:', validatedData.data)

    // Simulate API response
    const response: UpdateGarmentResponse = {
      status: 'success',
      message: 'Prenda actualizada exitosamente',
      id: validatedData.data.id,
      name: validatedData.data.name,
      price: validatedData.data.price
    }

    // Revalidate the clothes page
    revalidatePath('/seller/clothes')
    revalidatePath(`/seller/clothes/${validatedData.data.id}`)

    return {
      success: true as const,
      data: response,
      message: 'Prenda actualizada exitosamente'
    }
  } catch (error) {
    console.error('Error updating garment:', error)
    return {
      success: false as const,
      message:
        'Ocurrió un error al actualizar la prenda. Por favor, intenta de nuevo.'
    }
  }
}
