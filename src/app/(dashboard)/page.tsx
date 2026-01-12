import { auth } from '@/auth'

export default async function DashboardPage() {
  const session = await auth()
  const user = session?.user

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0] || 'User'}</h1>
      <p className="mt-2 text-muted-foreground">Dashboard overview will be displayed here.</p>
    </div>
  )
}
