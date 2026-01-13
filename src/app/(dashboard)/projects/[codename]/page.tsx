import { notFound } from 'next/navigation'
import Link from 'next/link'
import { LuArrowLeft } from 'react-icons/lu'
import { PageContainer } from '@/components/layout'
import { ProjectHeader } from '@/components/projects/ProjectHeader'
import { ProjectDetail } from '@/components/projects/ProjectDetail'
import { createAdminClient } from '@/lib/supabase/admin'

interface PageProps {
  params: Promise<{ codename: string }>
}

async function getProject(codename: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      vertical:verticals(*),
      status:project_statuses(*),
      repos:project_repos(*),
      links:project_links(*),
      team:team_members(*, user:users(*))
    `)
    .eq('codename', codename)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching project:', error)
    return null
  }

  return data
}

export default async function ProjectPage({ params }: PageProps) {
  const { codename } = await params
  const project = await getProject(codename)

  if (!project) {
    notFound()
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <Link
          href="/projects"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <LuArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
      </div>

      <ProjectHeader project={project} />
      <ProjectDetail project={project} />
    </PageContainer>
  )
}
