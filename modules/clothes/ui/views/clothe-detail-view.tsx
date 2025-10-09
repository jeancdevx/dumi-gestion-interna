'use client'

import { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { ArrowLeft, ImageIcon } from 'lucide-react'

import { ClothesDetail } from '@/modules/clothes/types'
import { AddToCartSelector } from '@/modules/clothes/ui/components/add-to-cart-selector'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { Separator } from '@/components/ui/separator'

import { formatPrice } from '../../helpers'

interface ClotheDetailViewProps {
  clothe: ClothesDetail
}

const ClotheDetailView = ({ clothe }: ClotheDetailViewProps) => {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index))
  }

  const validImages =
    clothe.clothe_image?.filter((_, index) => !imageErrors.has(index)) || []

  // Agrupar variantes por género
  const variantsByGender = clothe.clothes_variant.reduce(
    (acc, variant) => {
      const gender = variant.gender.gender
      if (!acc[gender]) {
        acc[gender] = []
      }
      acc[gender].push(variant)
      return acc
    },
    {} as Record<string, typeof clothe.clothes_variant>
  )

  // Obtener todas las tallas únicas
  const uniqueSizes = Array.from(
    new Set(clothe.clothes_variant.map(v => v.size.size))
  )

  const price = parseFloat(clothe.price)

  return (
    <div className='mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8'>
      {/* Botón de regreso */}
      <Link href='/admin/clothes'>
        <Button variant='ghost' className='mb-6 gap-2'>
          <ArrowLeft className='h-4 w-4' />
          Volver al catálogo
        </Button>
      </Link>

      <div className='grid gap-8 lg:grid-cols-2'>
        {/* Galería de imágenes */}
        <div className='bg-muted relative aspect-square overflow-hidden rounded-lg'>
          {validImages.length > 0 ? (
            validImages.length > 1 ? (
              <Carousel
                opts={{
                  loop: true
                }}
                className='h-full w-full'
              >
                <CarouselContent className='-ml-0 h-full'>
                  {validImages.map((image, index) => (
                    <CarouselItem key={index} className='pl-0'>
                      <div className='relative aspect-square h-full w-full'>
                        <Image
                          src={image.url}
                          alt={`${clothe.name} - imagen ${index + 1}`}
                          fill
                          className='object-cover'
                          sizes='(max-width: 1024px) 100vw, 50vw'
                          onError={() => handleImageError(index)}
                          priority={index === 0}
                          unoptimized
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className='left-4 h-10 w-10' />
                <CarouselNext className='right-4 h-10 w-10' />
              </Carousel>
            ) : (
              <div className='relative h-full w-full'>
                <Image
                  src={validImages[0].url}
                  alt={clothe.name}
                  fill
                  className='object-cover'
                  sizes='(max-width: 1024px) 100vw, 50vw'
                  onError={() => handleImageError(0)}
                  priority
                  unoptimized
                />
              </div>
            )
          ) : (
            <div className='flex h-full w-full flex-col items-center justify-center gap-2'>
              <ImageIcon className='text-muted-foreground size-16' />
              <span className='text-muted-foreground'>Sin imagen</span>
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className='flex flex-col gap-6'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight md:text-4xl'>
              {clothe.name}
            </h1>
            {clothe.description && (
              <p className='text-muted-foreground mt-2'>{clothe.description}</p>
            )}
          </div>

          <div className='flex items-baseline gap-2'>
            <span className='text-3xl font-bold'>{formatPrice(price)}</span>
          </div>

          <Separator />

          {/* Variantes por género */}
          <div className='space-y-6'>
            {Object.entries(variantsByGender).map(([gender, variants]) => (
              <div key={gender} className='space-y-3'>
                <h3 className='font-semibold'>{gender}</h3>
                <div className='flex flex-wrap gap-2'>
                  {variants.map(variant => {
                    const additionalPrice = parseFloat(variant.additional)
                    const totalPrice = price + additionalPrice

                    return (
                      <Badge
                        key={variant.id}
                        variant='outline'
                        className='flex flex-col items-start gap-1 px-4 py-2'
                      >
                        <span className='font-semibold'>
                          {variant.size.size}
                        </span>
                        {additionalPrice > 0 && (
                          <span className='text-muted-foreground text-xs'>
                            +{formatPrice(additionalPrice)} ={' '}
                            {formatPrice(totalPrice)}
                          </span>
                        )}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Agregar al carrito */}
          <AddToCartSelector clothe={clothe} />

          <Separator />

          {/* Tallas disponibles */}
          <div className='space-y-3'>
            <h3 className='font-semibold'>Tallas disponibles</h3>
            <div className='flex flex-wrap gap-2'>
              {uniqueSizes.map(size => (
                <Badge key={size} variant='secondary'>
                  {size}
                </Badge>
              ))}
            </div>
          </div>

          {/* Información adicional */}
          <div className='text-muted-foreground space-y-1 text-sm'>
            <p>
              Creado:{' '}
              {new Date(clothe.createdAt).toLocaleDateString('es-PE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            {/* <p>
              Última actualización:{' '}
              {new Date(clothe.updatedAt).toLocaleDateString('es-PE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export { ClotheDetailView }
