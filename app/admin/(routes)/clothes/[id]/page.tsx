import { Suspense } from 'react'

import { notFound } from 'next/navigation'

import { requireRole } from '@/lib/dal'

import { getClotheById } from '@/modules/clothes/server/queries'
import { ClotheDetailView } from '@/modules/clothes/ui/views/clothe-detail-view'

import { LoadingState } from '@/components/loading-state'

interface ClothePageProps {
  params: Promise<{ id: string }>
}

export default async function ClothePage({ params }: ClothePageProps) {
  await requireRole('admin')

  const { id } = await params

  const clothe = await getClotheById(id)

  if (!clothe) {
    notFound()
  }

  return (
    <Suspense
      fallback={
        <LoadingState
          title='Cargando prenda...'
          description='Esto puede tardar unos segundos'
        />
      }
    >
      <ClotheDetailView clothe={clothe} />
    </Suspense>
  )
}
