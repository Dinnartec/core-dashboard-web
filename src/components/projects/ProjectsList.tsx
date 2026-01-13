'use client'

import { useState, useMemo } from 'react'
import { LuSearch, LuFolderOpen } from 'react-icons/lu'
import { Input } from '@/components/ui/input'
import { EmptyState } from '@/components/ui/empty-state'
import { ProjectCard } from './ProjectCard'
import { VerticalFilter } from './VerticalFilter'
import type { ProjectWithRelations, VerticalRecord } from '@/types'

interface ProjectsListProps {
  projects: ProjectWithRelations[]
  verticals: VerticalRecord[]
}

export function ProjectsList({ projects, verticals }: ProjectsListProps) {
  const [selectedVertical, setSelectedVertical] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Filter by vertical
      if (selectedVertical !== 'all' && project.vertical.slug !== selectedVertical) {
        return false
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesName = project.name.toLowerCase().includes(query)
        const matchesCodename = project.codename.toLowerCase().includes(query)
        const matchesDescription = project.description?.toLowerCase().includes(query)
        if (!matchesName && !matchesCodename && !matchesDescription) {
          return false
        }
      }

      return true
    })
  }, [projects, selectedVertical, searchQuery])

  return (
    <div className="space-y-4">
      <VerticalFilter
        verticals={verticals}
        selected={selectedVertical}
        onChange={setSelectedVertical}
      />

      <div className="relative">
        <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={<LuFolderOpen className="h-12 w-12" />}
          title="No projects found"
          description={
            searchQuery || selectedVertical !== 'all'
              ? 'Try adjusting your filters or search query.'
              : 'Get started by creating your first project.'
          }
        />
      ) : (
        <div className="space-y-2">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
