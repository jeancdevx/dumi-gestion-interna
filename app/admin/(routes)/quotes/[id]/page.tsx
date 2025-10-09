import { Suspense } from 'react'

import { notFound } from 'next/navigation'

import { requireRole } from '@/lib/dal'

import { getQuoteById } from '@/modules/quotes/server/queries'
import { QuoteDetailView } from '@/modules/quotes/ui/views/quote-detail-view'

import { LoadingState } from '@/components/loading-state'

interface QuotePageProps {
  params: Promise<{ id: string }>
}

export default async function QuotePage({ params }: QuotePageProps) {
  await requireRole('admin')

  const { id } = await params

  const quote = await getQuoteById(id)

  if (!quote) {
    notFound()
  }

  return (
    <Suspense
      fallback={
        <LoadingState
          title='Cargando cotización...'
          description='Esto puede tardar unos segundos'
        />
      }
    >
      <QuoteDetailView quote={quote} />
    </Suspense>
  )
}
