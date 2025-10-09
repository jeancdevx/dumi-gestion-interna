'use client'

import Link from 'next/link'

import {
  CornerDownRightIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon
} from 'lucide-react'

import { ColumnDef } from '@tanstack/react-table'

import { Employee } from '@/modules/admin/types'

import { GeneratedAvatar } from '@/components/generated-avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'name',
    header: 'Empleado',
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
            <span className='text-muted-foreground max-w-[200px] truncate text-xs'>
              {row.original.email}
            </span>
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: 'roles',
    header: 'Rol',
    cell: ({ row }) => (
      <div className='flex gap-2'>
        {row.original.roles.map(role => (
          <Badge
            key={role}
            variant='secondary'
            className='bg-rose-600 font-semibold text-white capitalize'
          >
            {role}
          </Badge>
        ))}
      </div>
    )
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
      // console.log(row.original)

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
                href={`/admin/employees/${row.original.id}`}
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
