import { getEmployees } from '@/modules/admin/server/queries'

import { DataTable } from '@/components/data-table'

import { columns } from '../components/columns'

const EmployeeView = async () => {
  const employeesData = await getEmployees()

  if (
    !employeesData ||
    !employeesData.items ||
    !Array.isArray(employeesData.items)
  ) {
    return (
      <div className='flex flex-col items-center justify-center gap-y-4 py-12'>
        <p className='text-muted-foreground text-sm'>
          No se pudieron cargar los empleados
        </p>
      </div>
    )
  }

  return <DataTable columns={columns} data={employeesData.items} />
}

export { EmployeeView }
