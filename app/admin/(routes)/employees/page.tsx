import { requireRole } from '@/lib/dal'

import { EmployeesListHeader } from '@/modules/admin/ui/components/employees-list-header'
import { EmployeeView } from '@/modules/admin/ui/views/employee-view'

export default async function AdminEmployeesPage() {
  await requireRole('admin')

  return (
    <>
      <EmployeesListHeader />

      <EmployeeView />
    </>
  )
}
