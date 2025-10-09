import { Suspense } from 'react'

import { CustomerListHeader } from '@/modules/admin/ui/components/customer-list-header'
import { CustomerView } from '@/modules/admin/ui/views/customer-view'

import { LoadingState } from '@/components/loading-state'

export default function CustomerPage() {
  return (
    <div className='mx-auto flex h-full w-full max-w-7xl flex-col gap-y-4 px-4 py-4 md:px-6 md:py-6'>
      <CustomerListHeader />

      <Suspense
        fallback={
          <LoadingState
            title='Cargando clientes...'
            description='Por favor, espera mientras se cargan los clientes.'
          />
        }
      >
        <CustomerView />
      </Suspense>
    </div>
  )
}
