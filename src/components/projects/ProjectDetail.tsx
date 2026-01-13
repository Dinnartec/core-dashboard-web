'use client'

import { format } from 'date-fns'
import { LuGithub, LuExternalLink, LuUser } from 'react-icons/lu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
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
        {!project.repos || project.repos.length === 0 ? (
          <EmptyState
            icon={<LuGithub className="h-12 w-12" />}
            title="No repositories"
            description="Add repositories to track your project's codebase."
          />
        ) : (
          <div className="space-y-2">
            {project.repos.map((repo) => (
              <Card key={repo.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <LuGithub className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{repo.name}</span>
                        {repo.is_primary && (
                          <Badge variant="secondary" className="text-xs">
                            Primary
                          </Badge>
                        )}
                        {repo.type && (
                          <Badge variant="outline" className="text-xs">
                            {repo.type}
                          </Badge>
                        )}
                      </div>
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:underline"
                      >
                        {repo.url.replace('https://github.com/', '')}
                      </a>
                    </div>
                  </div>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <LuExternalLink className="h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="links" className="mt-6">
        {!project.links || project.links.length === 0 ? (
          <EmptyState
            icon={<LuExternalLink className="h-12 w-12" />}
            title="No links"
            description="Add links to deployments, documentation, or design files."
          />
        ) : (
          <div className="space-y-2">
            {project.links.map((link) => (
              <Card key={link.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <LuExternalLink className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{link.label}</span>
                        {link.type && (
                          <Badge variant="outline" className="text-xs">
                            {link.type}
                          </Badge>
                        )}
                      </div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:underline"
                      >
                        {link.url}
                      </a>
                    </div>
                  </div>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <LuExternalLink className="h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="team" className="mt-6">
        {!project.team || project.team.length === 0 ? (
          <EmptyState
            icon={<LuUser className="h-12 w-12" />}
            title="No team members"
            description="Assign team members to this project."
          />
        ) : (
          <div className="space-y-2">
            {project.team.map((member) => (
              <Card key={member.id}>
                <CardContent className="flex items-center gap-3 py-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.user.avatar_url} alt={member.user.name} />
                    <AvatarFallback>
                      {member.user.name?.charAt(0).toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{member.user.name}</span>
                      <Badge variant={member.role === 'lead' ? 'default' : 'secondary'}>
                        {member.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">@{member.user.username}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
