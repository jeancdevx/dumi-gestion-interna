'use client'

import { UpdateEmployeeFormData } from '@/modules/admin/schemas'

import { ResponsiveDialog } from '@/components/responsive-dialog'

import { EmployeeForm } from './employee-form'

interface UpdateEmployeeDialogProps {
  initialValues: UpdateEmployeeFormData
  open: boolean
  onOpenChange: (open: boolean) => void
}

const UpdateEmployeeDialog = ({
  initialValues,
  open,
  onOpenChange
}: UpdateEmployeeDialogProps) => {
  return (
    <ResponsiveDialog
      title='Actualizar Empleado'
      description='Rellena los datos para actualizar al empleado'
      open={open}
      onOpenChange={onOpenChange}
    >
      <EmployeeForm
        initialValues={initialValues}
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  )
}

export default UpdateEmployeeDialog
