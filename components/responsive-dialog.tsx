'use client'

import { useIsMobile } from '@/hooks/use-mobile'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer'

interface ResponsiveDialogProps {
  title: string
  description: string
  children: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
}

const ResponsiveDialog = ({
  title,
  description,
  children,
  open,
  onOpenChange,
  maxWidth = 'md'
}: ResponsiveDialogProps) => {
  const isMobile = useIsMobile()

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl'
  }

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className='max-h-[90vh]'>
          <DrawerHeader className='shrink-0'>
            <DrawerTitle className='text-center text-2xl'>{title}</DrawerTitle>
            <DrawerDescription className='text-center text-xs'>
              {description}
            </DrawerDescription>
          </DrawerHeader>

          <div className='min-h-0 flex-1 space-y-6 overflow-y-auto p-4'>
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`flex max-h-[90vh] flex-col overflow-hidden ${maxWidthClasses[maxWidth]}`}
      >
        <DialogHeader className='shrink-0 pb-4'>
          <DialogTitle className='text-center text-xl md:text-3xl'>
            {title}
          </DialogTitle>
          <DialogDescription className='text-center text-xs md:text-sm'>
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className='min-h-0 flex-1 space-y-6 overflow-y-auto px-1 pr-2'>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { ResponsiveDialog }
