'use client'

import { useRouter } from 'next/navigation'

import { ChevronDownIcon, LogOutIcon } from 'lucide-react'

import type { User } from '@/lib/dal'
import { useIsMobile } from '@/hooks/use-mobile'

import { logoutAction } from '@/modules/auth/server/logout'

import { GeneratedAvatar } from '@/components/generated-avatar'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

interface DashboardUserButtonProps {
  user: User
}

const DashboardUserButton = ({ user }: DashboardUserButtonProps) => {
  const router = useRouter()

  const isMobile = useIsMobile()

  const onLogOut = async () => {
    await logoutAction()
    router.push('/sign-in')
  }

  const fullName = `${user.names} ${user.lastNames}`

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger className='border-border/10 flex w-full items-center justify-between gap-x-2 overflow-hidden rounded-lg border bg-white/5 p-3 transition-colors hover:bg-white/10'>
          <GeneratedAvatar
            seed={fullName}
            variant='initials'
            className='mr-3 size-9'
          />

          <div className='flex min-w-0 flex-1 flex-col gap-0.5 overflow-hidden text-left'>
            <p className='truncate text-sm font-semibold'>{fullName}</p>
            <p className='text-muted-foreground truncate text-xs'>
              {user.email}
            </p>
          </div>

          <ChevronDownIcon className='ml-2 h-4 w-4 shrink-0 stroke-3 opacity-50' />
        </DrawerTrigger>

        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{fullName}</DrawerTitle>
            <DrawerDescription>{user.email}</DrawerDescription>
          </DrawerHeader>

          <DrawerFooter>
            <Button
              variant='destructive'
              className='bg-red-600/10 text-sm font-semibold text-red-700 hover:bg-red-600/20 focus:bg-red-600/20 focus:text-red-700'
              onClick={onLogOut}
            >
              Cerrar sesión
              <LogOutIcon className='size-4 stroke-[2.5] opacity-50' />
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='border-border/10 flex w-full cursor-pointer items-center justify-between gap-x-2 overflow-hidden rounded-lg border bg-white/10 p-3 backdrop-blur-md transition-colors hover:bg-white/20'>
        <GeneratedAvatar
          seed={fullName}
          variant='initials'
          className='mr-3 size-9'
        />

        <div className='flex min-w-0 flex-1 flex-col gap-0.5 overflow-hidden text-left'>
          <p className='w-full truncate text-sm font-semibold'>{user.names}</p>
          <p className='w-full truncate text-xs text-white'>{user.email}</p>
        </div>

        <ChevronDownIcon className='ml-2 h-4 w-4 shrink-0 stroke-3 opacity-50' />
      </DropdownMenuTrigger>

      <DropdownMenuContent side='right' align='end' className='ml-4 w-72'>
        <DropdownMenuLabel>
          <div className='flex flex-col gap-1'>
            <span className='truncate text-sm font-semibold text-black capitalize'>
              {fullName}
            </span>
            <span className='text-muted-foreground truncate text-xs'>
              {user.email}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <div className='flex flex-col gap-1'>
          <DropdownMenuItem
            onSelect={onLogOut}
            className='flex cursor-pointer items-center justify-center bg-red-400/10 text-xs font-semibold text-red-700 hover:text-red-700 focus:bg-red-400/15 focus:text-red-700'
          >
            Cerrar sesión
            <LogOutIcon className='size-4 stroke-[2.5] text-red-700 opacity-50' />
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { DashboardUserButton }
