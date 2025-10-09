import { z } from 'zod'

export const quoteDetailSchema = z.object({
  clothesVariantId: z.string().uuid('ID de variante inválido'),
  quantity: z.number().int().positive('La cantidad debe ser mayor a 0')
})

export const createQuoteSchema = z.object({
  details: z
    .array(quoteDetailSchema)
    .min(1, 'Debe agregar al menos una prenda'),
  customerId: z.string().uuid('ID de cliente inválido')
})
