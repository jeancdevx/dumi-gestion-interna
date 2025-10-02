import { z } from 'zod'

export const signInSchema = z.object({
  email: z
    .email('Por favor, ingresa un email válido')
    .min(1, 'El email es requerido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
})

export type SignInFormData = z.infer<typeof signInSchema>
