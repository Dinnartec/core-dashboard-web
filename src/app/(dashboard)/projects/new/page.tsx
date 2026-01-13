import Link from 'next/link'
import { LuArrowLeft } from 'react-icons/lu'
import { PageContainer } from '@/components/layout'
import { ProjectForm } from '@/components/projects/ProjectForm'
import { createAdminClient } from '@/lib/supabase/admin'

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

async function getStatuses() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('project_statuses')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching statuses:', error)
    return []
  }

  return data
}

export default async function NewProjectPage() {
  const [verticals, statuses] = await Promise.all([getVerticals(), getStatuses()])

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

      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">New Project</h1>
        <ProjectForm verticals={verticals} statuses={statuses} />
      </div>
    </PageContainer>
  )
}
