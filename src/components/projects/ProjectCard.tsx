'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { StatusBadge } from './StatusBadge'
import type { ProjectWithRelations, ProjectStatus } from '@/types'

interface ProjectCardProps {
  project: ProjectWithRelations
  className?: string
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const teamMembers = project.team?.slice(0, 3) || []
  const remainingCount = (project.team?.length || 0) - 3

  return (
    <Link
      href={`/projects/${project.codename}`}
      className={cn(
        'block border rounded-lg p-4 hover:bg-muted/50 transition-colors',
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold truncate">{project.codename}</h3>
            <StatusBadge status={project.status.slug as ProjectStatus} />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {project.vertical.name}
            {project.description && ` · ${project.description}`}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-1">
          {teamMembers.map((member) => (
            <Avatar key={member.id} className="h-6 w-6 border-2 border-background -ml-1 first:ml-0">
              <AvatarImage src={member.user.avatar_url} alt={member.user.name} />
              <AvatarFallback className="text-xs">
                {member.user.name?.charAt(0).toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
          ))}
          {remainingCount > 0 && (
            <span className="text-xs text-muted-foreground ml-1">+{remainingCount}</span>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          Updated {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
        </span>
      </div>
    </Link>
  )
}
