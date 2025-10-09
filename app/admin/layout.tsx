import { getUser } from '@/lib/dal'

import { getCustomers } from '@/modules/admin/server/queries'
import { AdminDashboardSidebar } from '@/modules/admin/ui/components/admin-dashboard-sidebar'

import { DashboardNavbar } from '@/components/dashboard-navbar'
import { SidebarProvider } from '@/components/ui/sidebar'

// Forzar renderizado dinámico porque usamos cookies para autenticación
export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user) {
    return null
  }

  const customersData = await getCustomers()
  const customers = customersData?.items || []

  return (
    <SidebarProvider>
      <AdminDashboardSidebar user={user} />

      <div className='bg-muted flex min-h-svh w-full flex-1 flex-col overflow-hidden'>
        <DashboardNavbar customers={customers} />

        <main className='flex-1 overflow-y-auto'>{children}</main>
      </div>
    </SidebarProvider>
  )
}
