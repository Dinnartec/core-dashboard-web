'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LuUser, LuPlus, LuTrash2 } from 'react-icons/lu'
import { Button } from '@/components/ui/button'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { EmptyState } from '@/components/ui/empty-state'
import type { TeamMemberWithUser, User } from '@/types'

interface TeamTabProps {
  projectId: string
  team: TeamMemberWithUser[]
}

export function TeamTab({ projectId, team: initialTeam }: TeamTabProps) {
  const router = useRouter()
  const [team, setTeam] = useState(initialTeam)
  const [users, setUsers] = useState<User[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    user_id: '',
    role: 'member',
  })

  useEffect(() => {
    if (showAddDialog && users.length === 0) {
      fetch('/api/users')
        .then(res => res.json())
        .then(data => setUsers(data))
        .catch(console.error)
    }
  }, [showAddDialog, users.length])

  const availableUsers = users.filter(
    user => !team.some(member => member.user_id === user.id)
  )

  const handleAdd = async () => {
    if (!formData.user_id) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const newMember = await response.json()
        setTeam([...team, newMember])
        setShowAddDialog(false)
        setFormData({ user_id: '', role: 'member' })
        router.refresh()
      }
    } catch (error) {
      console.error('Error adding team member:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (memberId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/team?memberId=${memberId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setTeam(team.filter(m => m.id !== memberId))
        router.refresh()
      }
    } catch (error) {
      console.error('Error removing team member:', error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setShowAddDialog(true)} size="sm">
          <LuPlus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      {team.length === 0 ? (
        <EmptyState
          icon={<LuUser className="h-12 w-12" />}
          title="No team members"
          description="Assign team members to this project."
        />
      ) : (
        <div className="space-y-2">
          {team.map((member) => (
            <Card key={member.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.user.avatar_url} alt={member.user.name} />
                    <AvatarFallback>
                      {member.user.name?.charAt(0).toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{member.user.name}</span>
                      <Badge variant={member.role === 'lead' ? 'default' : 'secondary'}>
                        {member.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">@{member.user.username}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-red-600"
                  onClick={() => handleDelete(member.id)}
                >
                  <LuTrash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>User *</Label>
              <Select
                value={formData.user_id}
                onValueChange={(value) => setFormData({ ...formData, user_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.length === 0 ? (
                    <SelectItem value="" disabled>No available users</SelectItem>
                  ) : (
                    availableUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} (@{user.username})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={isSubmitting || !formData.user_id}>
              {isSubmitting ? 'Adding...' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
