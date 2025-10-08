import { getUser } from '@/lib/dal'

import { SellerDashboardSidebar } from '@/modules/seller/ui/components/seller-dashboard-sidebar'

import { DashboardNavbar } from '@/components/dashboard-navbar'
import { SidebarProvider } from '@/components/ui/sidebar'

interface SellerPageProps {
  children: React.ReactNode
}

export default async function Layout({ children }: SellerPageProps) {
  const user = await getUser()

  if (!user) {
    return null
  }

  return (
    <SidebarProvider>
      <SellerDashboardSidebar user={user} />

      <div className='bg-muted flex min-h-svh w-full flex-1 flex-col overflow-hidden'>
        <DashboardNavbar />

        <main className='flex-1 overflow-y-auto'>{children}</main>
      </div>
    </SidebarProvider>
  )
}
