import { GalleryVerticalEnd } from 'lucide-react'

import { SignInForm } from '../components/sign-in-form'

const SignInView = () => {
  return (
    <>
      <div className='flex flex-col items-center justify-center gap-y-4 rounded-md'>
        <GalleryVerticalEnd className='size-6' />

        <h3 className='text-xl font-bold md:text-3xl lg:text-5xl'>
          Bienvenido de nuevo a Dumi
        </h3>
      </div>

      <SignInForm />

      <div className='text-muted-foreground *:[a]:hover:text-primary w-64 text-center text-xs text-balance'>
        By clicking continue, you agree to our <a href='#'>Terms of Service</a>{' '}
        and <a href='#'>Privacy Policy</a>.
      </div>
    </>
  )
}

export { SignInView }
