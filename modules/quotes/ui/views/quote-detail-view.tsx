'use client'

import Image from 'next/image'
import Link from 'next/link'

import { ArrowLeft } from 'lucide-react'

import { formatPrice } from '@/modules/clothes/helpers'
import { Quote } from '@/modules/quotes/types'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface QuoteDetailViewProps {
  quote: Quote
}

const statusMap = {
  PENDING: { label: 'Pendiente', variant: 'secondary' as const },
  APPROVED: { label: 'Aprobada', variant: 'default' as const },
  REJECTED: { label: 'Rechazada', variant: 'destructive' as const },
  COMPLETED: { label: 'Completada', variant: 'outline' as const }
}

const QuoteDetailView = ({ quote }: QuoteDetailViewProps) => {
  const statusInfo = statusMap[quote.status]
  const details = quote.details || []
  const total =
    typeof quote.total === 'string' ? parseFloat(quote.total) : quote.total

  return (
    <div className='mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8'>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <Link href='/admin/quotes'>
            <Button variant='ghost' className='mb-2 gap-2'>
              <ArrowLeft className='h-4 w-4' />
              Volver a cotizaciones
            </Button>
          </Link>
          <h1 className='text-3xl font-bold'>
            Cotización #{quote.id.substring(0, 8)}
          </h1>
          <p className='text-muted-foreground mt-1'>
            Creada el{' '}
            {new Date(quote.createdAt).toLocaleDateString('es-PE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <Badge variant={statusInfo.variant} className='px-4 py-2 text-base'>
          {statusInfo.label}
        </Badge>
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Detalles de la cotización */}
        <div className='space-y-6 lg:col-span-2'>
          <Card>
            <CardHeader>
              <CardTitle>Prendas ({details.length})</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {details.map(detail => (
                <div
                  key={detail.id}
                  className='flex gap-4 rounded-lg border p-4'
                >
                  {detail.clothesVariant?.clothes?.clothe_image?.[0] && (
                    <div className='relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md'>
                      <Image
                        src={detail.clothesVariant.clothes.clothe_image[0].url}
                        alt={detail.clothesVariant.clothes?.name || 'Prenda'}
                        fill
                        className='object-cover'
                        unoptimized
                      />
                    </div>
                  )}
                  <div className='flex-1'>
                    <h3 className='font-semibold'>
                      {detail.clothesVariant?.clothes?.name || 'Prenda'}
                    </h3>
                    <div className='mt-2 flex gap-2'>
                      <Badge variant='outline'>
                        {detail.clothesVariant?.size?.size || '-'}
                      </Badge>
                      <Badge variant='outline'>
                        {detail.clothesVariant?.gender?.gender || '-'}
                      </Badge>
                    </div>
                    <div className='mt-3 flex items-center justify-between'>
                      <div className='text-sm'>
                        <p className='text-muted-foreground'>
                          Precio unitario: {formatPrice(detail.unitPrice)}
                        </p>
                        <p className='text-muted-foreground'>
                          Cantidad: {detail.quantity}
                        </p>
                      </div>
                      <div className='text-right'>
                        <p className='text-lg font-semibold'>
                          {formatPrice(detail.unitPrice * detail.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Resumen */}
        <div className='space-y-6'>
          {/* Información del cliente */}
          {quote.customer && (
            <Card>
              <CardHeader>
                <CardTitle>Cliente</CardTitle>
              </CardHeader>
              <CardContent className='space-y-2'>
                <div>
                  <p className='text-sm font-medium'>Nombre</p>
                  <p className='text-muted-foreground'>
                    {quote.customer.names} {quote.customer.lastNames}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className='text-sm font-medium'>Teléfono</p>
                  <p className='text-muted-foreground'>
                    {quote.customer.phone}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resumen de precios */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                {details.map(detail => (
                  <div key={detail.id} className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>
                      {detail.quantity}x{' '}
                      {detail.clothesVariant?.clothes?.name || 'Prenda'}
                    </span>
                    <span>
                      {formatPrice(detail.unitPrice * detail.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className='flex justify-between text-lg font-semibold'>
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export { QuoteDetailView }
