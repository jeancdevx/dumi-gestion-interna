import { getClothes } from '@/modules/clothes/server/queries'
import { Catalog } from '@/modules/clothes/ui/components/catalog'

import EmptyState from '@/components/empty-state'

const ClothesView = async () => {
  const clothesData = await getClothes()

  if (!clothesData || !clothesData.items || !Array.isArray(clothesData.items)) {
    return (
      <div className='flex flex-col items-center justify-center gap-y-4 rounded-lg border-2 border-dashed py-12'>
        <p className='text-muted-foreground text-sm'>
          No se pudieron cargar las prendas
        </p>
      </div>
    )
  }

  return (
    <>
      <Catalog data={clothesData.items} />

      {clothesData.items.length === 0 && (
        <EmptyState
          title='No hay prendas'
          description='No se han encontrado prendas en el sistema.'
        />
      )}
    </>
  )
}

export { ClothesView }
