import { auth } from '@/auth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function getCurrentUser() {
  const session = await auth()
  return session?.user || null
}

export async function getCurrentUserWithRole() {
  const session = await auth()

  if (!session?.user?.email) {
    return null
  }

  const supabase = createAdminClient()

  const { data: user } = await supabase
    .from('users')
    .select(
      `
      *,
      role:roles(*)
    `
    )
    .eq('email', session.user.email)
    .single()

  return user
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  const user = await getCurrentUserWithRole()

  if (!user) return false

  const role = Array.isArray(user.role) ? user.role[0] : user.role
  return role?.name === 'admin'
}

export function checkPermission(
  userRole: string,
  action: string
): boolean {
  const permissions: Record<string, string[]> = {
    admin: [
      'projects:create',
      'projects:read',
      'projects:update',
      'projects:delete',
      'users:manage',
      'team:manage',
    ],
    member: [
      'projects:create',
      'projects:read',
      'projects:update',
    ],
    viewer: [
      'projects:read',
    ],
  }

  return permissions[userRole]?.includes(action) || false
}
