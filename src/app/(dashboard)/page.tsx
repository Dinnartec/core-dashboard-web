import { auth } from '@/auth'
import { PageContainer, PageHeader } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const verticals = [
  { name: 'Core', slug: 'core', count: 0 },
  { name: 'Solutions', slug: 'solutions', count: 0 },
  { name: 'Factory', slug: 'factory', count: 0 },
  { name: 'Labs', slug: 'labs', count: 0 },
]

export default async function DashboardPage() {
  const session = await auth()
  const user = session?.user

  return (
    <PageContainer>
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'User'}`}
        description="Here's an overview of your projects"
      />

      {/* Vertical Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {verticals.map((vertical) => (
          <Card key={vertical.slug}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {vertical.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{vertical.count}</p>
              <p className="text-xs text-muted-foreground">projects</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Projects placeholder */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Recent Projects</h2>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No projects yet. Create your first project to get started.
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
