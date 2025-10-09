'use client'

import { ResponsiveDialog } from '@/components/responsive-dialog'

import CustomerForm from './customer-form'

interface NewCustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const NewCustomerDialog = ({ open, onOpenChange }: NewCustomerDialogProps) => {
  return (
    <ResponsiveDialog
      title='Crear Nuevo Cliente'
      description='Rellena los datos para crear un nuevo cliente'
      open={open}
      onOpenChange={onOpenChange}
    >
      <CustomerForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  )
}

export default NewCustomerDialog
