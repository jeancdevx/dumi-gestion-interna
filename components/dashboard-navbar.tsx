'use client'

import { PanelLeftCloseIcon, PanelLeftIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'

const DashboardNavbar = () => {
  const { state, toggleSidebar, isMobile } = useSidebar()

  return (
    <>
      <nav className='bg-background flex items-center gap-x-2 border-b py-3'>
        <div className='mx-auto flex w-full max-w-7xl px-4 md:px-8'>
          <Button className='size-9' variant='outline' onClick={toggleSidebar}>
            {state === 'collapsed' || isMobile ? (
              <PanelLeftIcon className='size-4' />
            ) : (
              <PanelLeftCloseIcon className='size-4' />
            )}
          </Button>
        </div>
      </nav>
    </>
  )
}

export { DashboardNavbar }
