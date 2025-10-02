import { getUser, requireRole } from '@/lib/dal'

export default async function AdminPage() {
  await requireRole('admin')

  const user = await getUser()

  console.log('User in AdminPage:', user)

  return (
    <div>
      <h1>AdminPage</h1>
    </div>
  )
}
