import { requireRole } from '@/lib/dal'

import { EmployeeIdView } from '@/modules/admin/ui/views/employee-id-view'

export default async function AdminEmployeeIdPage() {
  await requireRole('admin')

  return (
    <main className='mx-auto flex w-full max-w-7xl flex-col gap-y-4 p-4 md:px-8 md:py-6'>
      <EmployeeIdView />
    </main>
  )
}
