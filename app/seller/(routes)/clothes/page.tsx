import { requireRole } from '@/lib/dal'

import { ClothesView } from '@/modules/seller/ui/views/clothes-view'

export default async function ClothesPage() {
  await requireRole('seller')

  return (
    <div className='mx-auto flex h-full w-full max-w-7xl flex-col gap-y-4 px-4 py-4 md:px-6 md:py-6'>
      <ClothesView />
    </div>
  )
}
