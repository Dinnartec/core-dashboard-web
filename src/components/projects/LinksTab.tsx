'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LuExternalLink, LuPlus, LuTrash2 } from 'react-icons/lu'
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
import type { ProjectLink } from '@/types'

interface LinksTabProps {
  projectId: string
  links: ProjectLink[]
}

export function LinksTab({ projectId, links: initialLinks }: LinksTabProps) {
  const router = useRouter()
  const [links, setLinks] = useState(initialLinks)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    label: '',
    url: '',
    type: '',
  })

  const handleAdd = async () => {
    if (!formData.label || !formData.url) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const newLink = await response.json()
        setLinks([...links, newLink])
        setShowAddDialog(false)
        setFormData({ label: '', url: '', type: '' })
        router.refresh()
      }
    } catch (error) {
      console.error('Error adding link:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (linkId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/links?linkId=${linkId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setLinks(links.filter(l => l.id !== linkId))
        router.refresh()
      }
    } catch (error) {
      console.error('Error deleting link:', error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setShowAddDialog(true)} size="sm">
          <LuPlus className="mr-2 h-4 w-4" />
          Add Link
        </Button>
      </div>

      {links.length === 0 ? (
        <EmptyState
          icon={<LuExternalLink className="h-12 w-12" />}
          title="No links"
          description="Add links to deployments, documentation, or design files."
        />
      ) : (
        <div className="space-y-2">
          {links.map((link) => (
            <Card key={link.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <LuExternalLink className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{link.label}</span>
                      {link.type && (
                        <Badge variant="outline" className="text-xs">{link.type}</Badge>
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
                <div className="flex items-center gap-2">
                  <a
                    href={link.url}
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
                    onClick={() => handleDelete(link.id)}
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
            <DialogTitle>Add Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="label">Label *</Label>
              <Input
                id="label"
                placeholder="Production"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL *</Label>
              <Input
                id="url"
                placeholder="https://example.com"
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
                  <SelectItem value="deploy">Deploy</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="docs">Documentation</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={isSubmitting || !formData.label || !formData.url}>
              {isSubmitting ? 'Adding...' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
