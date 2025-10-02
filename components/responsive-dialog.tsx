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
}

const ResponsiveDialog = ({
  title,
  description,
  children,
  open,
  onOpenChange
}: ResponsiveDialogProps) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className='text-center text-2xl'>{title}</DrawerTitle>
            <DrawerDescription className='text-center text-xs'>
              {description}
            </DrawerDescription>
          </DrawerHeader>

          <div className='p-4'>{children}</div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='space-y-4'>
        <DialogHeader>
          <DialogTitle className='text-center text-xl md:text-3xl'>
            {title}
          </DialogTitle>
          <DialogDescription className='text-center text-xs md:text-sm'>
            {description}
          </DialogDescription>
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  )
}

export { ResponsiveDialog }
