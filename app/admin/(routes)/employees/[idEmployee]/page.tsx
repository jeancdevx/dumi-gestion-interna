import { requireRole } from '@/lib/dal'

interface EmployeePageProps {
  params: Promise<{ idEmployee: string }>
}

export default async function EmployeePage({ params }: EmployeePageProps) {
  // ✅ SECURITY: Verify on every page (DAL pattern)
  await requireRole('admin')

  const { idEmployee } = await params

  return (
    <div>
      <h1>Employee: {idEmployee}</h1>
    </div>
  )
}
