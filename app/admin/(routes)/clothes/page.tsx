import { Suspense } from 'react'

import { requireRole } from '@/lib/dal'

import { GarmentsListHeader } from '@/modules/clothes/ui/components/garments-list-header'
import { ClothesView } from '@/modules/clothes/ui/views/clothes-view'

import { LoadingState } from '@/components/loading-state'

export const dynamic = 'force-dynamic'

export default async function ClothesPage() {
  await requireRole('admin')

  return (
    <div className='mx-auto flex h-full w-full max-w-7xl flex-col gap-y-4 px-4 py-4 md:px-6 md:py-6'>
      <GarmentsListHeader />

      <Suspense
        fallback={
          <LoadingState
            title='Cargando prendas...'
            description='Esto puede tardar unos segundos'
          />
        }
      >
        <ClothesView />
      </Suspense>
    </div>
  )
}
