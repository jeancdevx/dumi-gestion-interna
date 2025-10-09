import { Suspense } from 'react'

import { requireRole } from '@/lib/dal'

import { EmployeesListHeader } from '@/modules/admin/ui/components/employees-list-header'
import { EmployeeView } from '@/modules/admin/ui/views'

import { LoadingState } from '@/components/loading-state'

export default async function AdminEmployeesPage() {
  await requireRole('admin')

  return (
    <div className='mx-auto flex h-full w-full max-w-7xl flex-col gap-y-4 px-4 py-4 md:px-6 md:py-6'>
      <EmployeesListHeader />

      <Suspense
        fallback={
          <LoadingState
            title='Cargando empleados...'
            description='Por favor, espera mientras se cargan los empleados.'
          />
        }
      >
        <EmployeeView />
      </Suspense>
    </div>
  )
}
