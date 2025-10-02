import { z } from 'zod'

export const newEmployeeSchema = z.object({
  firstName: z.string().min(1, 'El nombre es obligatorio').trim(),
  lastName: z.string().min(1, 'El apellido es obligatorio').trim(),
  email: z
    .email('Por favor, ingresa un email válido')
    .min(1, 'El email es requerido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
})

export const updateEmployeeSchema = newEmployeeSchema.extend({
  id: z.string()
})

export type NewEmployeeFormData = z.infer<typeof newEmployeeSchema>
export type UpdateEmployeeFormData = z.infer<typeof updateEmployeeSchema>
