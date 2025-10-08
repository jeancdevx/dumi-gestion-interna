'use client'

import { useState } from 'react'

import { OctagonAlertIcon } from 'lucide-react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
  GarmentFormData,
  garmentSchema,
  UpdateGarmentFormData
} from '@/modules/seller/schemas'

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
import { Textarea } from '@/components/ui/textarea'

import { ImageUpload } from './image-upload'
import { SizeSelector } from './size-selector'

interface GarmentFormProps {
  initialValues?: UpdateGarmentFormData
  onSuccess?: () => void
  onCancel?: () => void
}

const GarmentForm = ({
  initialValues,
  onSuccess,
  onCancel
}: GarmentFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<GarmentFormData>({
    resolver: zodResolver(garmentSchema),
    defaultValues: initialValues || {
      name: '',
      price: 0,
      description: '',
      images: [],
      sizes: []
    }
  })

  const isEdit = !!initialValues?.id

  const onSubmit = async (data: GarmentFormData) => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      // TODO: Implementar la lógica de creación/actualización con Cloudflare R2
      console.log('Form data:', data)
      console.log('Images to upload:', data.images)
      console.log('Sizes:', data.sizes)

      // Simulación de éxito
      await new Promise(resolve => setTimeout(resolve, 1000))

      form.reset()
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrorMessage(
        'Ocurrió un error inesperado. Por favor, intenta de nuevo.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form className='w-full space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
        {/* Name and Price in Grid */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          {/* Name Field */}
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Nombre de la Prenda</FormLabel>
                <FormControl>
                  <Input
                    autoFocus
                    placeholder='Ej: Camisa de algodón'
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price Field */}
          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Precio</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <span className='text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-sm'>
                      S/
                    </span>
                    <Input
                      type='number'
                      step='0.01'
                      min='0'
                      placeholder='0.00'
                      disabled={isLoading}
                      className='pl-10'
                      {...field}
                      onChange={e => {
                        const value = e.target.value
                        field.onChange(value === '' ? 0 : parseFloat(value))
                      }}
                    />
                  </div>
                </FormControl>
                <FormDescription className='text-xs'>
                  Precio de venta en soles peruanos
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description Field */}
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Descripción{' '}
                <span className='text-muted-foreground'>(Opcional)</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Describe la prenda, materiales, características especiales...'
                  disabled={isLoading}
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormDescription className='text-xs'>
                Ayuda a tus clientes a conocer mejor el producto
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Images Upload - Full Width */}
        <FormField
          control={form.control}
          name='images'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imágenes de la Prenda</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  maxFiles={5}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sizes and Gender */}
        <FormField
          control={form.control}
          name='sizes'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SizeSelector
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription className='text-xs'>
                Agrega todas las tallas disponibles con su género
                correspondiente
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Error Alert */}
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

        {/* Action Buttons */}
        <div className='flex w-full justify-stretch gap-4'>
          {onCancel && (
            <Button
              type='button'
              variant='outline'
              onClick={onCancel}
              disabled={isLoading}
              className='flex-1'
            >
              Cancelar
            </Button>
          )}
          <Button type='submit' className='flex-1' disabled={isLoading}>
            {isLoading
              ? 'Guardando...'
              : isEdit
                ? 'Actualizar Prenda'
                : 'Crear Prenda'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export { GarmentForm }
