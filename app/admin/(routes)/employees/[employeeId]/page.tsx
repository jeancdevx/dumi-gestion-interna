import { requireRole } from '@/lib/dal'

import { EmployeeIdView } from '@/modules/admin/ui/views/employee-id-view'

export default async function AdminEmployeeIdPage() {
  await requireRole('admin')

  return (
    <div className='mx-auto flex h-full w-full max-w-7xl flex-col gap-y-4 px-4 py-4 md:px-6 md:py-6'>
      <EmployeeIdView />
    </div>
  )
}
