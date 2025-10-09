import { z } from 'zod'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
]

export const garmentSizeSchema = z.object({
  size: z.string().min(1, 'La talla es obligatoria'),
  gender: z.enum(['hombre', 'mujer', 'unisex'], {
    message: 'Selecciona un género válido'
  }),
  additional: z
    .number({
      message: 'El precio adicional debe ser un número válido'
    })
    .min(0, 'El precio adicional no puede ser negativo')
})

export const garmentSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').trim(),
  price: z
    .number({
      message: 'El precio debe ser un número válido'
    })
    .min(0.01, 'El precio debe ser mayor a 0'),
  description: z.string().optional(),
  images: z
    .array(
      z
        .instanceof(File)
        .refine(
          file => file.size <= MAX_FILE_SIZE,
          'El tamaño máximo de la imagen es 5MB'
        )
        .refine(
          file => ACCEPTED_IMAGE_TYPES.includes(file.type),
          'Solo se aceptan imágenes en formato JPG, PNG o WEBP'
        )
    )
    .min(1, 'Debe subir al menos una imagen')
    .max(5, 'Puede subir un máximo de 5 imágenes'),
  sizes: z
    .array(garmentSizeSchema)
    .min(1, 'Debe agregar al menos una talla con su género')
    .refine(
      sizes => {
        const combinations = sizes.map(s => `${s.size}-${s.gender}`)
        const uniqueCombinations = new Set(combinations)
        return combinations.length === uniqueCombinations.size
      },
      {
        message:
          'No puedes tener combinaciones duplicadas de talla y género (ej: M-Unisex solo puede aparecer una vez)'
      }
    )
})

export const updateGarmentSchema = garmentSchema.extend({
  id: z.string()
})

export type GarmentSizeFormData = z.infer<typeof garmentSizeSchema>
export type GarmentFormData = z.infer<typeof garmentSchema>
export type UpdateGarmentFormData = z.infer<typeof updateGarmentSchema>
