'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { LuFolderOpen } from 'react-icons/lu'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/projects'
import { EmptyState } from '@/components/ui/empty-state'
import type { ProjectStatus } from '@/types'

interface RecentProject {
  id: string
  name: string
  codename: string
  updated_at: string
  vertical: { slug: string; name: string } | { slug: string; name: string }[]
  status: { slug: string; name: string } | { slug: string; name: string }[]
}

interface RecentProjectsProps {
  projects: RecentProject[]
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  if (projects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<LuFolderOpen className="h-10 w-10" />}
            title="No projects yet"
            description="Create your first project to get started."
          />
        </CardContent>
      </Card>
    )
  }

  const getVertical = (vertical: RecentProject['vertical']) =>
    Array.isArray(vertical) ? vertical[0] : vertical

  const getStatus = (status: RecentProject['status']) =>
    Array.isArray(status) ? status[0] : status

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Projects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.map((project) => {
          const vertical = getVertical(project.vertical)
          const status = getStatus(project.status)

          return (
            <Link
              key={project.id}
              href={`/projects/${project.codename}`}
              className="flex items-center justify-between py-2 hover:bg-muted/50 -mx-2 px-2 rounded-md transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{project.codename}</span>
                  {status && <StatusBadge status={status.slug as ProjectStatus} />}
                </div>
                <p className="text-sm text-muted-foreground">
                  {vertical?.name}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
              </span>
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}
