'use client'

import { PanelLeftCloseIcon, PanelLeftIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'

const DashboardNavbar = () => {
  const { state, toggleSidebar, isMobile } = useSidebar()

  return (
    <nav className='bg-background z-40 w-full border-b'>
      <div className='mx-auto flex w-full max-w-7xl items-center gap-x-2 px-4 py-3 md:px-6'>
        <Button className='size-9' variant='outline' onClick={toggleSidebar}>
          {state === 'collapsed' || isMobile ? (
            <PanelLeftIcon className='size-4' />
          ) : (
            <PanelLeftCloseIcon className='size-4' />
          )}
        </Button>
      </div>
    </nav>
  )
}

export { DashboardNavbar }
