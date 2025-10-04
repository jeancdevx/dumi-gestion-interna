import { getUser } from '@/lib/dal'

import { AdminDashboardSidebar } from '@/modules/admin/ui/components/admin-dashboard-sidebar'

import { DashboardNavbar } from '@/components/dashboard-navbar'
import { SidebarProvider } from '@/components/ui/sidebar'

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user) {
    return null
  }

  return (
    <SidebarProvider>
      <AdminDashboardSidebar user={user} />

      <div className='bg-muted flex min-h-svh w-full flex-1 flex-col overflow-hidden'>
        <DashboardNavbar />

        <main className='flex-1 overflow-y-auto'>{children}</main>
      </div>
    </SidebarProvider>
  )
}
