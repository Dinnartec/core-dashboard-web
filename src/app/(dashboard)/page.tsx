import Link from 'next/link'
import { LuPlus } from 'react-icons/lu'
import { auth } from '@/auth'
import { PageContainer, PageHeader } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { VerticalStats, RecentProjects } from '@/components/dashboard'
import { createAdminClient } from '@/lib/supabase/admin'

async function getStats() {
  const supabase = createAdminClient()

  // Get all verticals
  const { data: verticals } = await supabase
    .from('verticals')
    .select('id, slug, name')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (!verticals) return []

  // Get project counts per vertical
  const { data: projects } = await supabase
    .from('projects')
    .select('vertical_id')
    .eq('is_active', true)

  const counts: Record<string, number> = {}
  projects?.forEach((project) => {
    counts[project.vertical_id] = (counts[project.vertical_id] || 0) + 1
  })

  return verticals.map((vertical) => ({
    id: vertical.id,
    slug: vertical.slug,
    name: vertical.name,
    count: counts[vertical.id] || 0,
  }))
}

async function getRecentProjects() {
  const supabase = createAdminClient()

  const { data } = await supabase
    .from('projects')
    .select(`
      id,
      name,
      codename,
      updated_at,
      vertical:verticals(slug, name),
      status:project_statuses(slug, name)
    `)
    .eq('is_active', true)
    .order('updated_at', { ascending: false })
    .limit(5)

  return data || []
}

export default async function DashboardPage() {
  const session = await auth()
  const user = session?.user

  const [stats, recentProjects] = await Promise.all([
    getStats(),
    getRecentProjects(),
  ])

  return (
    <PageContainer>
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'User'}`}
        description="Here's an overview of your projects"
      >
        <Button asChild>
          <Link href="/projects/new">
            <LuPlus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </PageHeader>

      <VerticalStats stats={stats} />

      <RecentProjects projects={recentProjects} />
    </PageContainer>
  )
}
