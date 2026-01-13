'use client'

import { useState, useEffect } from 'react'
import { LuUsers, LuUserMinus, LuLoader } from 'react-icons/lu'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { EmptyState } from '@/components/ui/empty-state'

interface User {
  id: string
  name: string
  email: string
  username: string
  avatar_url?: string
  is_active: boolean
  role: { id: string; name: string } | { id: string; name: string }[]
}

interface Role {
  id: string
  name: string
  description?: string
}

interface TeamManagementProps {
  currentUserId: string
}

export function TeamManagement({ currentUserId }: TeamManagementProps) {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null)
  const [changingRoleFor, setChangingRoleFor] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, rolesRes] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/roles'),
        ])

        if (usersRes.ok && rolesRes.ok) {
          const usersData = await usersRes.json()
          const rolesData = await rolesRes.json()
          setUsers(usersData)
          setRoles(rolesData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const getRole = (user: User) => {
    return Array.isArray(user.role) ? user.role[0] : user.role
  }

  async function handleRoleChange(userId: string, roleId: string) {
    setChangingRoleFor(userId)
    try {
      const response = await fetch(`/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role_id: roleId }),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUsers(users.map((u) => (u.id === userId ? updatedUser : u)))
      }
    } catch (error) {
      console.error('Error changing role:', error)
    } finally {
      setChangingRoleFor(null)
    }
  }

  async function handleDeactivate() {
    if (!userToDeactivate) return

    try {
      const response = await fetch(`/api/users/${userToDeactivate.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setUsers(users.filter((u) => u.id !== userToDeactivate.id))
      }
    } catch (error) {
      console.error('Error deactivating user:', error)
    } finally {
      setUserToDeactivate(null)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team</CardTitle>
          <CardDescription>Manage team members and roles</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <LuLoader className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (users.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team</CardTitle>
          <CardDescription>Manage team members and roles</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<LuUsers className="h-10 w-10" />}
            title="No team members"
            description="Team members will appear here once they log in."
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Team</CardTitle>
          <CardDescription>Manage team members and roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => {
              const role = getRole(user)
              const isCurrentUser = user.id === currentUserId
              const initials = user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)

              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar_url} alt={user.name} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{user.name}</p>
                        {isCurrentUser && (
                          <Badge variant="secondary">You</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCurrentUser ? (
                      <Badge variant="outline" className="capitalize">
                        {role?.name || 'member'}
                      </Badge>
                    ) : (
                      <>
                        <Select
                          value={role?.id}
                          onValueChange={(value) =>
                            handleRoleChange(user.id, value)
                          }
                          disabled={changingRoleFor === user.id}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((r) => (
                              <SelectItem key={r.id} value={r.id}>
                                <span className="capitalize">{r.name}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setUserToDeactivate(user)}
                          title="Deactivate user"
                        >
                          <LuUserMinus className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={!!userToDeactivate}
        onOpenChange={() => setUserToDeactivate(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate user</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate {userToDeactivate?.name}? They
              will no longer be able to access the dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeactivate}>
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
