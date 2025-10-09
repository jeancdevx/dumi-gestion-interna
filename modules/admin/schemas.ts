import { z } from 'zod'

export const employeeSchema = z.object({
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

export const updateEmployeeSchema = employeeSchema.extend({
  id: z.string()
})

const regexPhone = /^(?:\+51)?[ -]?9\d{8}$/

export const customerSchema = z.object({
  firstName: z.string().min(1, 'El nombre es obligatorio').trim(),
  lastName: z.string().min(1, 'El apellido es obligatorio').trim(),
  phone: z
    .string()
    .min(1, 'El teléfono es obligatorio')
    .regex(regexPhone, 'El teléfono debe ser un número válido de Perú')
    .trim(),
  reference: z.string().optional()
})

export const updateCustomerSchema = customerSchema.extend({
  id: z.string()
})

export type EmployeeFormData = z.infer<typeof employeeSchema>
export type UpdateEmployeeFormData = z.infer<typeof updateEmployeeSchema>
export type CustomerFormData = z.infer<typeof customerSchema>
export type UpdateCustomerFormData = z.infer<typeof updateCustomerSchema>
