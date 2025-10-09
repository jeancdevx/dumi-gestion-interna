'use client'

import { useState } from 'react'

import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

import NewGarmentDialog from './new-garment-dialog'

const GarmentsListHeader = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

  return (
    <>
      <NewGarmentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      <div className='flex items-center justify-between'>
        <h5 className='text-xl font-semibold md:text-3xl'>Mis Prendas</h5>

        <Button onClick={() => setIsDialogOpen(true)}>
          Crear Prenda <PlusIcon />
        </Button>
      </div>
    </>
  )
}

export { GarmentsListHeader }
