'use client'

import { useState } from 'react'

import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

import NewEmployeeDialog from './new-employee-dialog'

const EmployeesListHeader = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

  return (
    <>
      <NewEmployeeDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      <div className='flex items-center justify-between'>
        <h5 className='text-xl font-semibold md:text-3xl'>Mis Empleados</h5>

        <Button onClick={() => setIsDialogOpen(true)}>
          Crear Empleado <PlusIcon />
        </Button>
      </div>
    </>
  )
}

export { EmployeesListHeader }
