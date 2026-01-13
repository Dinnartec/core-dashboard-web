'use client'

import { format } from 'date-fns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ReposTab } from './ReposTab'
import { LinksTab } from './LinksTab'
import { TeamTab } from './TeamTab'
import type { ProjectWithRelations } from '@/types'

interface ProjectDetailProps {
  project: ProjectWithRelations
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <Tabs defaultValue="overview" className="mt-6">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="repos">Repos</TabsTrigger>
        <TabsTrigger value="links">Links</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <div className="space-y-6">
          {project.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{project.description}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">Started</dt>
                  <dd className="font-medium">
                    {project.started_at
                      ? format(new Date(project.started_at), 'MMMM d, yyyy')
                      : '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Launched</dt>
                  <dd className="font-medium">
                    {project.launched_at
                      ? format(new Date(project.launched_at), 'MMMM d, yyyy')
                      : '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Created</dt>
                  <dd className="font-medium">
                    {format(new Date(project.created_at), 'MMMM d, yyyy')}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Last Updated</dt>
                  <dd className="font-medium">
                    {format(new Date(project.updated_at), 'MMMM d, yyyy')}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="repos" className="mt-6">
        <ReposTab projectId={project.id} repos={project.repos || []} />
      </TabsContent>

      <TabsContent value="links" className="mt-6">
        <LinksTab projectId={project.id} links={project.links || []} />
      </TabsContent>

      <TabsContent value="team" className="mt-6">
        <TeamTab projectId={project.id} team={project.team || []} />
      </TabsContent>
    </Tabs>
  )
}
