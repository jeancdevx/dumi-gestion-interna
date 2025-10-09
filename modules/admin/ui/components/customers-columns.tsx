'use client'

import Link from 'next/link'

import {
  CornerDownRightIcon,
  EllipsisVerticalIcon,
  LocationEditIcon,
  PencilIcon,
  TrashIcon
} from 'lucide-react'

import { ColumnDef } from '@tanstack/react-table'

import { Customer } from '@/modules/admin/types'

import { GeneratedAvatar } from '@/components/generated-avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export const customersColumns: ColumnDef<Customer>[] = [
  {
    accessorKey: 'name',
    header: 'Cliente',
    cell: ({ row }) => {
      const fullName = `${row.original.names} ${row.original.lastNames}`

      return (
        <div className='flex flex-col gap-y-1'>
          <div className='flex items-center gap-x-2'>
            <GeneratedAvatar
              variant='initials'
              seed={fullName}
              className='size-8'
            />
            <span className='font-semibold capitalize'>{fullName}</span>
          </div>

          <div className='flex items-center gap-x-1.5'>
            <CornerDownRightIcon className='text-muted-foreground size-3' />
            <span className='text-muted-foreground flex items-center gap-x-1 text-xs'>
              <LocationEditIcon className='size-3' />
              {row.original.reference}
            </span>
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: () => (
      <Badge
        variant='secondary'
        className='bg-violet-600 font-semibold text-white capitalize'
      >
        customer
      </Badge>
    )
  },
  {
    accessorKey: 'phone',
    header: 'Teléfono',
    cell: ({ row }) => <span className='text-sm'>{row.original.phone}</span>
  },
  {
    accessorKey: 'createdAt',
    header: 'Fecha de creación',
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
  },
  {
    accessorKey: 'actions',
    header: 'Acciones',
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='sm'>
              <EllipsisVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='space-y-1'>
            <DropdownMenuItem>
              <Link
                href={`/admin/customers/${row.original.id}`}
                className='flex items-center gap-x-2'
              >
                <PencilIcon />
                Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              variant='destructive'
              className='cursor-pointer bg-red-400/10 text-sm text-red-700'
            >
              <TrashIcon className='text-red-700' />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]
