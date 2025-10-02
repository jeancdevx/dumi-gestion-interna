'use client'

import { useState } from 'react'

import { EyeIcon, EyeOffIcon, OctagonAlertIcon } from 'lucide-react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
  EmployeeFormData,
  employeeSchema,
  UpdateEmployeeFormData
} from '@/modules/admin/schemas'
import {
  createEmployeeAction,
  updateEmployeeAction
} from '@/modules/admin/server/actions'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface EmployeeFormProps {
  initialValues?: UpdateEmployeeFormData
  onSuccess?: () => void
  onCancel?: () => void
}

const EmployeeForm = ({
  initialValues,
  onSuccess,
  onCancel
}: EmployeeFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialValues || {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    }
  })

  const isEdit = !!initialValues?.id

  const onSubmit = async (data: EmployeeFormData) => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const formData = new FormData()

      if (isEdit && initialValues?.id) {
        formData.append('id', initialValues.id)
      }

      formData.append('firstName', data.firstName)
      formData.append('lastName', data.lastName)
      formData.append('email', data.email)
      formData.append('password', data.password)

      const result = isEdit
        ? await updateEmployeeAction(formData)
        : await createEmployeeAction(formData)

      if (!result.success) {
        if ('errors' in result && result.errors) {
          const firstNameError = result.errors.firstName?.[0]
          const lastNameError = result.errors.lastName?.[0]
          const emailError = result.errors.email?.[0]
          const passwordError = result.errors.password?.[0]

          if (firstNameError) {
            form.setError('firstName', { message: firstNameError })
          }
          if (lastNameError) {
            form.setError('lastName', { message: lastNameError })
          }
          if (emailError) {
            form.setError('email', { message: emailError })
          }
          if (passwordError) {
            form.setError('password', { message: passwordError })
          }
        }

        if (result.message) {
          setErrorMessage(result.message)
        }
      } else {
        form.reset()
        if (onSuccess) {
          onSuccess()
        }
      }
    } catch {
      setErrorMessage(
        'Ocurrió un error inesperado. Por favor, intenta de nuevo.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        className='mx-auto w-full max-w-md space-y-6'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombres</FormLabel>
                <FormControl>
                  <Input
                    autoFocus
                    placeholder='Eddu'
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='lastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellidos</FormLabel>
                <FormControl>
                  <Input placeholder='Dev' disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder='eddu@edducode.me'
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='********'
                    disabled={isLoading}
                    {...field}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent'
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOffIcon className='h-4 w-4' />
                    ) : (
                      <EyeIcon className='h-4 w-4' />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
              <FormDescription>
                La contraseña debe tener al menos 6 caracteres.
              </FormDescription>
            </FormItem>
          )}
        />

        {errorMessage && (
          <Alert
            variant='destructive'
            className='bg-destructive/10 flex items-center gap-x-4 border-none text-sm'
          >
            <div className='flex'>
              <OctagonAlertIcon className='size-4' />
            </div>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className='flex w-full justify-stretch gap-4'>
          {onCancel && (
            <Button
              type='button'
              variant='outline'
              onClick={onCancel}
              disabled={isLoading}
              className='flex-1'
            >
              Cancel
            </Button>
          )}
          <Button type='submit' className='flex-1' disabled={isLoading}>
            {isEdit ? 'Actualizar Empleado' : 'Crear Empleado'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export { EmployeeForm }
