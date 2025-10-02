interface SignInLayoutProps {
  children: React.ReactNode
}

export default function SignInLayout({ children }: SignInLayoutProps) {
  return (
    <main className='mx-auto flex min-h-svh max-w-5xl items-center justify-center'>
      {children}
    </main>
  )
}
