import { Suspense } from 'react'

import { requireRole } from '@/lib/dal'

import { getOrders } from '@/modules/orders/server/queries'
import { OrdersView } from '@/modules/orders/ui/views'
import { getPendingQuotes } from '@/modules/quotes/server/queries'

import { LoadingState } from '@/components/loading-state'

export default async function OrdersPage() {
  await requireRole('admin')

  const [ordersData, pendingQuotes] = await Promise.all([
    getOrders(),
    getPendingQuotes()
  ])

  const orders = ordersData?.items || []

  return (
    <div className='mx-auto flex h-full w-full max-w-7xl flex-col gap-y-4 px-4 py-4 md:px-6 md:py-6'>
      <Suspense
        fallback={
          <LoadingState
            title='Cargando órdenes...'
            description='Por favor espera un momento'
          />
        }
      >
        <OrdersView orders={orders} pendingQuotes={pendingQuotes} />
      </Suspense>
    </div>
  )
}
