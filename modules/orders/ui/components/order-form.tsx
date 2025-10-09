'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  OctagonAlertIcon
} from 'lucide-react'

import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useForm } from 'react-hook-form'

import { cn } from '@/lib/utils'

import {
  CreateOrderFormData,
  createOrderSchema
} from '@/modules/orders/schemas'
import { createOrderAction } from '@/modules/orders/server/actions'
import { Quote } from '@/modules/quotes/types'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

interface OrderFormProps {
  pendingQuotes: Quote[]
  onSuccess?: () => void
  onCancel?: () => void
}

export const OrderForm = ({
  pendingQuotes,
  onSuccess,
  onCancel
}: OrderFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<CreateOrderFormData>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      quoteId: '',
      deliveryDate: undefined,
      department: '',
      city: '',
      district: '',
      street: ''
    }
  })

  const onSubmit = async (data: CreateOrderFormData) => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const formData = new FormData()
      formData.append('quoteId', data.quoteId)
      formData.append('deliveryDate', data.deliveryDate.toISOString())
      formData.append('department', data.department)
      formData.append('city', data.city)
      formData.append('district', data.district)
      formData.append('street', data.street)

      const result = await createOrderAction(formData)

      if (!result.success) {
        if ('errors' in result && result.errors) {
          Object.entries(result.errors).forEach(([key, value]) => {
            if (value && value[0]) {
              form.setError(key as keyof CreateOrderFormData, {
                message: value[0]
              })
            }
          })
        }

        if (result.message) {
          setErrorMessage(result.message)
        }
      } else {
        form.reset()
        if (onSuccess) {
          onSuccess()
        }
        router.push('/admin/orders')
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

  // Calcular fechas mínima y máxima
  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 7)

  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 60)

  return (
    <Form {...form}>
      <form className='w-full space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
        {/* Quote Selector */}
        <FormField
          control={form.control}
          name='quoteId'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>Cotización</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant='outline'
                      role='combobox'
                      className={cn(
                        'w-full justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                      disabled={isLoading}
                    >
                      {field.value
                        ? pendingQuotes.find(quote => quote.id === field.value)
                            ?.customer
                          ? `${pendingQuotes.find(quote => quote.id === field.value)?.customer?.names} ${pendingQuotes.find(quote => quote.id === field.value)?.customer?.lastNames} - ID: ${field.value.slice(0, 8)}...`
                          : `ID: ${field.value.slice(0, 8)}...`
                        : 'Seleccionar cotización'}
                      <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-full p-0'>
                  <Command>
                    <CommandInput placeholder='Buscar cotización...' />
                    <CommandList>
                      <CommandEmpty>
                        No se encontraron cotizaciones pendientes.
                      </CommandEmpty>
                      <CommandGroup>
                        {pendingQuotes.map(quote => (
                          <CommandItem
                            key={quote.id}
                            value={quote.id}
                            onSelect={() => {
                              form.setValue('quoteId', quote.id)
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                quote.id === field.value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            <div className='flex flex-col'>
                              <span>
                                {quote.customer
                                  ? `${quote.customer.names} ${quote.customer.lastNames}`
                                  : 'Cliente desconocido'}
                              </span>
                              <span className='text-muted-foreground text-xs'>
                                ID: {quote.id.slice(0, 8)}... - Total: S/{' '}
                                {typeof quote.total === 'string'
                                  ? parseFloat(quote.total).toFixed(2)
                                  : quote.total.toFixed(2)}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription className='text-xs'>
                Selecciona una cotización pendiente para crear la orden
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Delivery Date */}
        <FormField
          control={form.control}
          name='deliveryDate'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>Fecha de Entrega</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant='outline'
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                      disabled={isLoading}
                    >
                      {field.value ? (
                        format(field.value, 'PPP', { locale: es })
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                      <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={date => date < minDate || date > maxDate}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
              <FormDescription className='text-xs'>
                Mínimo 7 días, máximo 60 días desde hoy
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address Fields */}
        <div className='space-y-4 rounded-lg border p-4'>
          <h3 className='font-semibold'>Dirección de Entrega</h3>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {/* Department */}
            <FormField
              control={form.control}
              name='department'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departamento</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Ej: La Libertad'
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* City */}
            <FormField
              control={form.control}
              name='city'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ciudad</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Ej: Trujillo'
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* District */}
            <FormField
              control={form.control}
              name='district'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Distrito</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Ej: Trujillo'
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Street */}
            <FormField
              control={form.control}
              name='street'
              render={({ field }) => (
                <FormItem className='md:col-span-2'>
                  <FormLabel>Calle</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Ej: Av. Jesus de Nazaret 390'
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

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
            {isLoading ? 'Creando...' : 'Crear Orden'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
