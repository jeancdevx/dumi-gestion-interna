'use client'

import { useState } from 'react'

import { PanelLeftCloseIcon, PanelLeftIcon } from 'lucide-react'

import { CartDrawer } from '@/modules/quotes/ui/components/cart-drawer'
import { CustomerSelector } from '@/modules/quotes/ui/components/customer-selector'

import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'

interface Customer {
  id: string
  names: string
  lastNames: string
  phone: string
}

interface DashboardNavbarProps {
  customers: Customer[]
}

const DashboardNavbar = ({ customers }: DashboardNavbarProps) => {
  const { state, toggleSidebar, isMobile } = useSidebar()
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>()

  return (
    <nav className='bg-background z-40 w-full border-b'>
      <div className='mx-auto flex w-full max-w-7xl items-center justify-between gap-x-4 px-4 py-3 md:px-6'>
        <Button className='size-9' variant='outline' onClick={toggleSidebar}>
          {state === 'collapsed' || isMobile ? (
            <PanelLeftIcon className='size-4' />
          ) : (
            <PanelLeftCloseIcon className='size-4' />
          )}
        </Button>

        <div className='flex items-center gap-4'>
          <CustomerSelector
            customers={customers}
            onCustomerSelect={setSelectedCustomerId}
          />
          <CartDrawer customerId={selectedCustomerId} />
        </div>
      </div>
    </nav>
  )
}

export { DashboardNavbar }
