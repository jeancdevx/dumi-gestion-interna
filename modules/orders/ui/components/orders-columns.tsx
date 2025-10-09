'use client'

import { MoreHorizontal } from 'lucide-react'

import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

import { Order } from '@/modules/orders/types'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const formatPrice = (price: string | number): string => {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price
  return `S/ ${numericPrice.toFixed(2)}`
}

const getStatusBadge = (status: Order['status']) => {
  const statusMap = {
    IN_PRODUCTION: { label: 'En Producción', variant: 'default' as const },
    DELIVERED: { label: 'Entregado', variant: 'secondary' as const },
    CANCELLED: { label: 'Cancelado', variant: 'destructive' as const }
  }

  const config = statusMap[status] || {
    label: status,
    variant: 'default' as const
  }
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export const ordersColumns: ColumnDef<Order>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      const id = row.original.id
      return <span className='font-mono text-xs'>{id.slice(0, 8)}...</span>
    }
  },
  {
    id: 'customer',
    header: 'Cliente',
    cell: ({ row }) => {
      // El backend devuelve customer directamente en order, no en quote
      const customer = row.original.customer || row.original.quote?.customer
      if (!customer) return <span className='text-muted-foreground'>-</span>
      return (
        <span>
          {customer.names} {customer.lastNames}
        </span>
      )
    }
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ row }) => {
      return (
        <span className='font-semibold'>{formatPrice(row.original.total)}</span>
      )
    }
  },
  {
    accessorKey: 'deliveryDate',
    header: 'Fecha de Entrega',
    cell: ({ row }) => {
      const date = new Date(row.original.deliveryDate)
      return <span>{format(date, 'dd MMM yyyy', { locale: es })}</span>
    }
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => getStatusBadge(row.original.status)
  },
  {
    id: 'address',
    header: 'Dirección',
    cell: ({ row }) => {
      const address = row.original.address
      if (!address) return <span className='text-muted-foreground'>-</span>
      return (
        <div className='max-w-[200px] truncate text-sm'>
          {address.street}, {address.district}
        </div>
      )
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Fecha de Creación',
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt)
      return (
        <span className='text-muted-foreground text-sm'>
          {format(date, 'dd MMM yyyy', { locale: es })}
        </span>
      )
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const order = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Abrir menú</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(order.id)}
            >
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuItem>Ver detalles</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]
