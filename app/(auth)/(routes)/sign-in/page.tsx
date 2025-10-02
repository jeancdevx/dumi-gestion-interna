import { redirectIfAuthenticated } from '@/lib/dal'

import { SignInView } from '@/modules/auth/ui/views'

export default async function SignInPage() {
  await redirectIfAuthenticated()

  return (
    <div className='flex flex-col items-center justify-center gap-y-8'>
      <SignInView />
    </div>
  )
}
