import { getUser } from '@/lib/dal'

import { getCustomers } from '@/modules/admin/server/queries'
import { SellerDashboardSidebar } from '@/modules/seller/ui/components/seller-dashboard-sidebar'

import { DashboardNavbar } from '@/components/dashboard-navbar'
import { SidebarProvider } from '@/components/ui/sidebar'

// Forzar renderizado dinámico porque usamos cookies para autenticación
export const dynamic = 'force-dynamic'

interface SellerPageProps {
  children: React.ReactNode
}

export default async function Layout({ children }: SellerPageProps) {
  const user = await getUser()

  if (!user) {
    return null
  }

  const customersData = await getCustomers()
  const customers = customersData?.items || []

  return (
    <SidebarProvider>
      <SellerDashboardSidebar user={user} />

      <div className='bg-muted flex min-h-svh w-full flex-1 flex-col overflow-hidden'>
        <DashboardNavbar customers={customers} />

        <main className='flex-1 overflow-y-auto'>{children}</main>
      </div>
    </SidebarProvider>
  )
}
