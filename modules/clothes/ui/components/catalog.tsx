'use client'

import { ClothesItem } from '@/modules/clothes/types'

import { GarmentCard } from './garment-card'

interface CatalogProps {
  data: ClothesItem[]
}

const Catalog = ({ data }: CatalogProps) => {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {data.map((item, index) => {
        const isLarge = index % 7 === 0

        return (
          <div
            key={item.id}
            className={
              isLarge ? 'sm:col-span-2 sm:row-span-2' : 'col-span-1 row-span-1'
            }
          >
            <GarmentCard
              id={item.id}
              name={item.name}
              description={item.description ?? ''}
              price={parseFloat(item.price)}
              images={item.clothe_image}
              priority={index < 3} // Prioridad para las primeras 3 imágenes
            />
          </div>
        )
      })}
    </div>
  )
}

export { Catalog }
