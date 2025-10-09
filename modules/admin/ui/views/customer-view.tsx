import { getCustomers } from '@/modules/admin/server/queries'

import { DataTable } from '@/components/data-table'

import { customersColumns } from '../components/customers-columns'

const CustomerView = async () => {
  const customersData = await getCustomers()

  if (
    !customersData ||
    !customersData.items ||
    !Array.isArray(customersData.items)
  ) {
    return (
      <div className='flex flex-col items-center justify-center gap-y-4 py-12'>
        <p className='text-muted-foreground text-sm'>
          No se pudieron cargar los clientes
        </p>
      </div>
    )
  }

  return <DataTable columns={customersColumns} data={customersData.items} />
}

export { CustomerView }
