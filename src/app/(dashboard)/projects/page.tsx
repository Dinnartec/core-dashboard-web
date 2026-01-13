import Link from 'next/link'
import { LuPlus } from 'react-icons/lu'
import { PageContainer, PageHeader } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { ProjectsList } from '@/components/projects'
import { createAdminClient } from '@/lib/supabase/admin'

async function getProjects() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      vertical:verticals(*),
      status:project_statuses(*),
      team:team_members(*, user:users(*))
    `)
    .eq('is_active', true)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }

  return data
}

async function getVerticals() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('verticals')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching verticals:', error)
    return []
  }

  return data
}

export default async function ProjectsPage() {
  const [projects, verticals] = await Promise.all([getProjects(), getVerticals()])

  return (
    <PageContainer>
      <PageHeader title="Projects" description="Manage your projects across all verticals">
        <Button asChild>
          <Link href="/projects/new">
            <LuPlus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </PageHeader>

      <ProjectsList projects={projects} verticals={verticals} />
    </PageContainer>
  )
}
