import { requireRole } from '@/lib/dal'

export default async function SellerPage() {
  await requireRole('seller')

  return (
    <div className='mx-auto flex h-full w-full max-w-7xl flex-col gap-y-4 px-4 py-4 md:px-6 md:py-6'>
      <h1 className='text-3xl font-semibold'>Panel de Vendedor</h1>
    </div>
  )
}
