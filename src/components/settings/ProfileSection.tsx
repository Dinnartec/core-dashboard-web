'use client'

import { useState } from 'react'
import { LuPencil, LuCheck, LuX } from 'react-icons/lu'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ProfileSectionProps {
  user: {
    id: string
    name: string
    email: string
    username: string
    avatar_url?: string
    role?: { name: string } | { name: string }[]
  }
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user.name)
  const [isLoading, setIsLoading] = useState(false)

  const role = Array.isArray(user.role) ? user.role[0] : user.role
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  async function handleSave() {
    if (!name.trim() || name.trim() === user.name) {
      setIsEditing(false)
      setName(user.name)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      setIsEditing(false)
      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Error updating profile:', error)
      setName(user.name)
    } finally {
      setIsLoading(false)
    }
  }

  function handleCancel() {
    setName(user.name)
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Your personal information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar_url} alt={user.name} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="grid gap-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Name</p>
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <LuPencil className="h-4 w-4" />
                </Button>
              )}
            </div>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  <LuCheck className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <LuX className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{user.name}</p>
            )}
          </div>

          <Separator />

          <div className="grid gap-1">
            <p className="text-sm font-medium">Email</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          <Separator />

          <div className="grid gap-1">
            <p className="text-sm font-medium">Role</p>
            <p className="text-sm text-muted-foreground capitalize">{role?.name || 'Member'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
