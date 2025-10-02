export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* header */}

      <main className='mx-auto flex min-h-svh w-screen max-w-7xl flex-col space-y-4 overflow-auto p-4'>
        {children}
      </main>
    </>
  )
}
