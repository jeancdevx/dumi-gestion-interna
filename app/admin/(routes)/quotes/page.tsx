import { Suspense } from 'react'

import { requireRole } from '@/lib/dal'

import { QuotesView } from '@/modules/quotes/ui/views/quotes-view'

import { LoadingState } from '@/components/loading-state'

export default async function QuotesPage() {
  await requireRole('admin')

  return (
    <div className='mx-auto flex h-full w-full max-w-7xl flex-col gap-y-4 px-4 py-4 md:px-6 md:py-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-semibold'>Cotizaciones</h1>
          <p className='text-muted-foreground mt-1'>
            Gestiona las cotizaciones de tus clientes
          </p>
        </div>
      </div>

      <Suspense
        fallback={
          <LoadingState
            title='Cargando cotizaciones...'
            description='Esto puede tardar unos segundos'
          />
        }
      >
        <QuotesView />
      </Suspense>
    </div>
  )
}
