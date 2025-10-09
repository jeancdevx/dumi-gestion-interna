'use client'

import { ResponsiveDialog } from '@/components/responsive-dialog'

import { GarmentForm } from './garment-form'

interface NewGarmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const NewGarmentDialog = ({ open, onOpenChange }: NewGarmentDialogProps) => {
  return (
    <ResponsiveDialog
      title='Crear Nueva Prenda'
      description='Completa los datos para registrar una nueva prenda en el catálogo'
      open={open}
      onOpenChange={onOpenChange}
      maxWidth='3xl'
    >
      <GarmentForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  )
}

export default NewGarmentDialog
