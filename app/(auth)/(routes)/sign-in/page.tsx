import { redirectIfAuthenticated } from '@/lib/dal'

import { SignInView } from '@/modules/auth/ui/views'

// Forzar renderizado dinámico porque verificamos autenticación con cookies
export const dynamic = 'force-dynamic'

export default async function SignInPage() {
  await redirectIfAuthenticated()

  return (
    <div className='flex flex-col items-center justify-center gap-y-8'>
      <SignInView />
    </div>
  )
}
