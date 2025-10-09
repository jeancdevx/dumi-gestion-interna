'use client'

import { useState } from 'react'

import { OctagonAlertIcon } from 'lucide-react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
  CustomerFormData,
  customerSchema,
  UpdateCustomerFormData
} from '@/modules/admin/schemas'
import { createCustomerAction } from '@/modules/admin/server/customer-actions'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface CustomerFormProps {
  initialValues?: UpdateCustomerFormData
  onSuccess?: () => void
  onCancel?: () => void
}

const CustomerForm = ({
  initialValues,
  onSuccess,
  onCancel
}: CustomerFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: initialValues || {
      firstName: '',
      lastName: '',
      phone: '',
      reference: ''
    }
  })

  const isEdit = !!initialValues?.id

  const onSubmit = async (data: CustomerFormData) => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const formData = new FormData()

      formData.append('firstName', data.firstName)
      formData.append('lastName', data.lastName)
      formData.append('phone', data.phone)
      if (data.reference) {
        formData.append('reference', data.reference)
      }

      const result = await createCustomerAction(formData)

      if (!result.success) {
        if ('errors' in result && result.errors) {
          const firstNameError = result.errors.firstName?.[0]
          const lastNameError = result.errors.lastName?.[0]
          const phoneError = result.errors.phone?.[0]
          const referenceError = result.errors.reference?.[0]

          if (firstNameError) {
            form.setError('firstName', { message: firstNameError })
          }
          if (lastNameError) {
            form.setError('lastName', { message: lastNameError })
          }
          if (phoneError) {
            form.setError('phone', { message: phoneError })
          }
          if (referenceError) {
            form.setError('reference', { message: referenceError })
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

        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input
                  placeholder='987654321'
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
          name='reference'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Referencia</FormLabel>
              <FormControl>
                <Input
                  placeholder='Referencia'
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
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
            {isEdit ? 'Actualizar Cliente' : 'Crear Cliente'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default CustomerForm
