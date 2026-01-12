import { auth } from '@/auth'
import { createClient } from '@/lib/supabase/server'

export async function getCurrentUser() {
  const session = await auth()
  return session?.user || null
}

export async function getCurrentUserWithRole() {
  const session = await auth()

  if (!session?.user?.email) {
    return null
  }

  const supabase = await createClient()

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
