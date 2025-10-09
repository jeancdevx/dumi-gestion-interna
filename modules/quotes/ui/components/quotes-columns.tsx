'use client'

import Link from 'next/link'

import { Eye } from 'lucide-react'

import { ColumnDef } from '@tanstack/react-table'

import { formatPrice } from '@/modules/clothes/helpers'
import { Quote } from '@/modules/quotes/types'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const statusMap = {
  PENDING: { label: 'Pendiente', variant: 'secondary' as const },
  APPROVED: { label: 'Aprobada', variant: 'default' as const },
  REJECTED: { label: 'Rechazada', variant: 'destructive' as const },
  COMPLETED: { label: 'Completada', variant: 'outline' as const }
}

export const quotesColumns: ColumnDef<Quote>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      const id = row.original.id
      return <span className='font-mono text-xs'>{id.substring(0, 8)}...</span>
    }
  },
  {
    accessorKey: 'customer',
    header: 'Cliente',
    cell: ({ row }) => {
      const customer = row.original.customer
      if (!customer) return <span className='text-muted-foreground'>-</span>
      return (
        <div>
          <p className='font-medium'>
            {customer.names} {customer.lastNames}
          </p>
          <p className='text-muted-foreground text-xs'>{customer.phone}</p>
        </div>
      )
    }
  },
  {
    accessorKey: 'details',
    header: 'Prendas',
    cell: ({ row }) => {
      const totalClothes = row.original.totalClothes ?? 0
      const totalUnits = row.original.totalUnitsToProduced ?? 0
      return (
        <div className=''>
          <p className='font-medium'>{totalUnits}</p>
          <p className='text-muted-foreground text-xs'>
            {totalClothes} tipo{totalClothes !== 1 ? 's' : ''}
          </p>
        </div>
      )
    }
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ row }) => {
      const total =
        typeof row.original.total === 'string'
          ? parseFloat(row.original.total)
          : row.original.total
      return (
        <span className='text-sm font-semibold text-green-600'>
          {formatPrice(total)}
        </span>
      )
    }
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = row.original.status
      const statusInfo = statusMap[status]
      return (
        <Badge
          variant={statusInfo.variant}
          className='bg-yellow-600/80 text-xs font-semibold text-white'
        >
          {statusInfo.label}
        </Badge>
      )
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Fecha',
    cell: ({ row }) => {
      return new Date(row.original.createdAt).toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => {
      return (
        <Link href={`/admin/quotes/${row.original.id}`}>
          <Button variant='ghost' size='icon'>
            <Eye className='h-4 w-4' />
          </Button>
        </Link>
      )
    }
  }
]
