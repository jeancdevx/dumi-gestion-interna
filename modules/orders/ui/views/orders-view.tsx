'use client'

import { useState } from 'react'

import { PlusIcon } from 'lucide-react'

import { Order } from '@/modules/orders/types'
import { OrderForm } from '@/modules/orders/ui/components/order-form'
import { ordersColumns } from '@/modules/orders/ui/components/orders-columns'
import { Quote } from '@/modules/quotes/types'

import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

interface OrdersViewProps {
  orders: Order[]
  pendingQuotes: Quote[]
}

export const OrdersView = ({ orders, pendingQuotes }: OrdersViewProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Órdenes</h1>
          <p className='text-muted-foreground mt-1'>
            Gestiona las órdenes de producción y entregas
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className='mr-2 h-4 w-4' />
              Nueva Orden
            </Button>
          </DialogTrigger>
          <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-[600px]'>
            <DialogHeader>
              <DialogTitle>Crear Nueva Orden</DialogTitle>
              <DialogDescription>
                Selecciona una cotización pendiente y completa la información de
                entrega
              </DialogDescription>
            </DialogHeader>
            <OrderForm
              pendingQuotes={pendingQuotes}
              onSuccess={() => setIsDialogOpen(false)}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable columns={ordersColumns} data={orders} />
    </div>
  )
}
