'use client'

import { useState } from 'react'

import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

import NewCustomerDialog from './new-customer-dialog'

const CustomerListHeader = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

  return (
    <>
      <NewCustomerDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      <div className='flex items-center justify-between'>
        <h5 className='text-xl font-semibold md:text-3xl'>Mis Clientes</h5>

        <Button onClick={() => setIsDialogOpen(true)}>
          Crear Cliente <PlusIcon />
        </Button>
      </div>
    </>
  )
}

export { CustomerListHeader }
