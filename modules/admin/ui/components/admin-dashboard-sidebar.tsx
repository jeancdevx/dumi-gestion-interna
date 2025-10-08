'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { BackpackIcon, StarIcon, UsersIcon, WalletIcon } from 'lucide-react'

import type { User } from '@/lib/dal'
import { cn } from '@/lib/utils'

import { DashboardUserButton } from '@/components/dashboard-user-button'
import { Separator } from '@/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'

const firstSection = [
  {
    icon: UsersIcon,
    label: 'Empleados',
    href: '/admin/employees'
  },
  {
    icon: BackpackIcon,
    label: 'Prendas',
    href: '/admin/clothes'
  },
  {
    icon: WalletIcon,
    label: 'Cotizaciones',
    href: '/admin/quotes'
  }
]

const secondSection = [
  {
    icon: StarIcon,
    label: 'Upgrade',
    href: '/upgrade'
  }
]

interface AdminDashboardSidebarProps {
  user: User
}

const AdminDashboardSidebar = ({ user }: AdminDashboardSidebarProps) => {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className='text-sidebar-accent-foreground'>
        <Link href='/admin' className='flex items-center gap-2 px-2 pt-2'>
          <Image src='/logo.svg' alt='Logo' width={36} height={36} />
          <p className='text-2xl font-semibold'>Dumi</p>
        </Link>
      </SidebarHeader>

      <div className='px-4 py-2'>
        <Separator className='text-[#5D6B68] opacity-10' />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {firstSection.map(({ icon: Icon, label, href }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    className={cn(
                      'from-sidebar-accent via-sidebar/50 to-sidebar/50 h-10 from-5% via-30% hover:bg-linear-to-r/oklch',
                      pathname === href && 'bg-linear-to-r/oklch'
                    )}
                    isActive={pathname === href}
                    asChild
                  >
                    <Link href={href}>
                      <Icon className='size-5 stroke-[2.5]' />
                      <span className='text-sm font-semibold tracking-tight'>
                        {label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className='px-4'>
          <Separator className='text-[#7b3306] opacity-10' />
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondSection.map(({ icon: Icon, label, href }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      'from-sidebar-accent via-sidebar/50 to-sidebar/50 h-10 from-5% via-30% hover:bg-linear-to-r/oklch',
                      pathname === href && 'bg-linear-to-r/oklch'
                    )}
                    isActive={pathname === href}
                  >
                    <Link href={href}>
                      <Icon className='size-5 stroke-[2.5]' />
                      <span className='text-sm font-semibold tracking-tight'>
                        {label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className='mb-2 text-white'>
        <DashboardUserButton user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}

export { AdminDashboardSidebar }
