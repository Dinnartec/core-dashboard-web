'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LuGithub, LuExternalLink, LuPlus, LuTrash2 } from 'react-icons/lu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import type { ProjectRepo } from '@/types'

interface ReposTabProps {
  projectId: string
  repos: ProjectRepo[]
}

export function ReposTab({ projectId, repos: initialRepos }: ReposTabProps) {
  const router = useRouter()
  const [repos, setRepos] = useState(initialRepos)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    type: '',
    is_primary: false,
  })

  const handleAdd = async () => {
    if (!formData.name || !formData.url) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/repos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const newRepo = await response.json()
        if (formData.is_primary) {
          setRepos(repos.map(r => ({ ...r, is_primary: false })).concat(newRepo))
        } else {
          setRepos([...repos, newRepo])
        }
        setShowAddDialog(false)
        setFormData({ name: '', url: '', type: '', is_primary: false })
        router.refresh()
      }
    } catch (error) {
      console.error('Error adding repo:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (repoId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/repos?repoId=${repoId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setRepos(repos.filter(r => r.id !== repoId))
        router.refresh()
      }
    } catch (error) {
      console.error('Error deleting repo:', error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setShowAddDialog(true)} size="sm">
          <LuPlus className="mr-2 h-4 w-4" />
          Add Repo
        </Button>
      </div>

      {repos.length === 0 ? (
        <EmptyState
          icon={<LuGithub className="h-12 w-12" />}
          title="No repositories"
          description="Add repositories to track your project's codebase."
        />
      ) : (
        <div className="space-y-2">
          {repos.map((repo) => (
            <Card key={repo.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <LuGithub className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{repo.name}</span>
                      {repo.is_primary && (
                        <Badge variant="secondary" className="text-xs">Primary</Badge>
                      )}
                      {repo.type && (
                        <Badge variant="outline" className="text-xs">{repo.type}</Badge>
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
                <div className="flex items-center gap-2">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground p-2"
                  >
                    <LuExternalLink className="h-4 w-4" />
                  </a>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-red-600"
                    onClick={() => handleDelete(repo.id)}
                  >
                    <LuTrash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Repository</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="my-project-web"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">GitHub URL *</Label>
              <Input
                id="url"
                placeholder="https://github.com/org/repo"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">Web</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                  <SelectItem value="app">App</SelectItem>
                  <SelectItem value="docs">Docs</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_primary"
                checked={formData.is_primary}
                onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="is_primary">Primary repository</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={isSubmitting || !formData.name || !formData.url}>
              {isSubmitting ? 'Adding...' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
