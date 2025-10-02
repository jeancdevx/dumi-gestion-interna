import { Suspense } from 'react'

import { requireRole } from '@/lib/dal'

import { EmployeesListHeader } from '@/modules/admin/ui/components/employees-list-header'
import { EmployeeView } from '@/modules/admin/ui/views'

import { LoadingState } from '@/components/loading-state'

export default async function AdminEmployeesPage() {
  await requireRole('admin')

  return (
    <>
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
    </>
  )
}
