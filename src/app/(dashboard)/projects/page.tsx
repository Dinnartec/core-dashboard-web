import Link from 'next/link'
import { LuPlus, LuFolderOpen } from 'react-icons/lu'
import { PageContainer, PageHeader } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'

export default function ProjectsPage() {
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

      {/* Projects list will be implemented in Phase 3 */}
      <EmptyState
        icon={<LuFolderOpen className="h-12 w-12" />}
        title="No projects yet"
        description="Get started by creating your first project."
        action={
          <Button asChild>
            <Link href="/projects/new">
              <LuPlus className="mr-2 h-4 w-4" />
              New Project
            </Link>
          </Button>
        }
      />
    </PageContainer>
  )
}
