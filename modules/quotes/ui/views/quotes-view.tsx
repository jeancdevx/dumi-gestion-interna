import { getQuotes } from '@/modules/quotes/server/queries'
import { quotesColumns } from '@/modules/quotes/ui/components/quotes-columns'

import { DataTable } from '@/components/data-table'
import EmptyState from '@/components/empty-state'

const QuotesView = async () => {
  const quotesData = await getQuotes()

  if (!quotesData || !quotesData.items || !Array.isArray(quotesData.items)) {
    return (
      <div className='flex flex-col items-center justify-center gap-y-4 rounded-lg border-2 border-dashed py-12'>
        <p className='text-muted-foreground text-sm'>
          No se pudieron cargar las cotizaciones
        </p>
      </div>
    )
  }

  return (
    <>
      {quotesData.items.length === 0 ? (
        <EmptyState
          title='No hay cotizaciones'
          description='No se han creado cotizaciones aún.'
        />
      ) : (
        <DataTable columns={quotesColumns} data={quotesData.items} />
      )}
    </>
  )
}

export { QuotesView }
