import { requireRole } from '@/lib/dal'

export default async function NewPage() {
  // ✅ SECURITY: Verify on every page (DAL pattern)
  await requireRole('admin')

  return (
    <>
      <h1>New Employee</h1>
    </>
  )
}
