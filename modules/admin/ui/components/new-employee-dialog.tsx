'use client'

import { ResponsiveDialog } from '@/components/responsive-dialog'

import { EmployeeForm } from './employee-form'

interface NewEmployeeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const NewEmployeeDialog = ({ open, onOpenChange }: NewEmployeeDialogProps) => {
  return (
    <ResponsiveDialog
      title='Crear Nuevo Empleado'
      description='Rellena los datos para crear un nuevo empleado'
      open={open}
      onOpenChange={onOpenChange}
    >
      <EmployeeForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  )
}

export default NewEmployeeDialog
