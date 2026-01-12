import { auth } from '@/auth'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { SessionProvider } from 'next-auth/react'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const user = session?.user

  return (
    <SessionProvider session={session}>
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden w-64 border-r md:block">
          <Sidebar />
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col">
          <Header user={user!} />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SessionProvider>
  )
}
