import { z } from 'zod'

// Validación de fecha: mínimo 7 días, máximo 60 días desde hoy
const minDeliveryDate = new Date()
minDeliveryDate.setDate(minDeliveryDate.getDate() + 7)

const maxDeliveryDate = new Date()
maxDeliveryDate.setDate(maxDeliveryDate.getDate() + 60)

export const createOrderSchema = z.object({
  quoteId: z.string().min(1, 'Debe seleccionar una cotización'),
  deliveryDate: z
    .date({
      message: 'La fecha de entrega es obligatoria'
    })
    .refine(
      date => date >= minDeliveryDate,
      'La fecha de entrega debe ser al menos 7 días desde hoy'
    )
    .refine(
      date => date <= maxDeliveryDate,
      'La fecha de entrega no puede ser mayor a 60 días desde hoy'
    ),
  department: z
    .string()
    .min(1, 'El departamento es obligatorio')
    .max(100, 'El departamento no puede exceder 100 caracteres'),
  city: z
    .string()
    .min(1, 'La ciudad es obligatoria')
    .max(100, 'La ciudad no puede exceder 100 caracteres'),
  district: z
    .string()
    .min(1, 'El distrito es obligatorio')
    .max(100, 'El distrito no puede exceder 100 caracteres'),
  street: z
    .string()
    .min(1, 'La calle es obligatoria')
    .max(200, 'La calle no puede exceder 200 caracteres')
})

export type CreateOrderFormData = z.infer<typeof createOrderSchema>
