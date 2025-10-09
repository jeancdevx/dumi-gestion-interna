'use client'

import { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { ImageIcon } from 'lucide-react'

import { ClothesImage } from '@/modules/clothes/types'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'

import { formatPrice } from '../../helpers'

interface GarmentCardProps {
  id: string
  name: string
  description?: string
  price: number
  images: ClothesImage[]
  priority?: boolean
}

const GarmentCard = ({
  id,
  name,
  price,
  images,
  priority = false
}: GarmentCardProps) => {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index))
  }

  const validImages =
    images?.filter((_, index) => !imageErrors.has(index)) || []

  return (
    <div className='group relative aspect-square overflow-hidden rounded-lg'>
      <div className='relative h-full w-full'>
        {validImages.length > 0 ? (
          validImages.length > 1 ? (
            <div className='relative z-10 h-full w-full'>
              <Carousel
                opts={{
                  loop: true
                }}
                className='h-full w-full'
              >
                <CarouselContent className='-ml-0 h-full'>
                  {validImages.map((image, index) => (
                    <CarouselItem key={`${name}-${index}`} className='pl-0'>
                      <div className='relative aspect-square h-full w-full'>
                        <Image
                          src={image.url}
                          alt={`${name} - imagen ${index + 1}`}
                          fill
                          className='object-cover transition-transform duration-300 ease-in-out group-hover:scale-105'
                          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                          onError={() => handleImageError(index)}
                          priority={priority && index === 0}
                          unoptimized
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className='left-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100' />
                <CarouselNext className='right-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100' />
              </Carousel>
            </div>
          ) : (
            <div className='relative h-full w-full'>
              <Image
                src={validImages[0].url}
                alt={name}
                fill
                className='object-cover transition-transform duration-300 ease-in-out group-hover:scale-105'
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                onError={() => handleImageError(0)}
                priority={priority}
                unoptimized
              />
            </div>
          )
        ) : (
          <div className='bg-muted flex h-full w-full flex-col items-center justify-center gap-2'>
            <ImageIcon className='text-muted-foreground size-12' />
            <span className='text-muted-foreground text-sm'>Sin imagen</span>
          </div>
        )}

        {/* Image Count Badge */}
        {validImages.length > 1 && (
          <div className='pointer-events-none absolute top-2 right-2 z-30 rounded-full bg-black/50 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm'>
            {validImages.length} fotos
          </div>
        )}

        <Link
          href={`/admin/clothes/${id}`}
          className='absolute right-4 bottom-2 left-4 z-30 flex max-w-[calc(100%-2rem)] items-center justify-between gap-x-4 rounded-full bg-black/50 px-3 py-1 text-white transition-all hover:bg-black/70'
        >
          <h3 className='truncate text-sm font-semibold'>{name}</h3>
          <div className='shrink-0 rounded-full bg-orange-300/50 px-3 py-1 backdrop-blur-md'>
            <p className='text-sm font-semibold'>{formatPrice(price)}</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

export { GarmentCard }
