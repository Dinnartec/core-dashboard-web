import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createAdminClient } from '@/lib/supabase/admin'

interface RouteParams {
  params: Promise<{ id: string }>
}

// PATCH /api/users/[id]/role - Change user role (admin only)
export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const supabase = createAdminClient()

  // Check if current user is admin
  const { data: currentUser } = await supabase
    .from('users')
    .select('role:roles(name)')
    .eq('id', session.user.id)
    .single()

  const currentRole = currentUser?.role as { name: string } | { name: string }[] | null
  const isAdmin = Array.isArray(currentRole)
    ? currentRole[0]?.name === 'admin'
    : currentRole?.name === 'admin'

  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Prevent changing own role
  if (id === session.user.id) {
    return NextResponse.json({ error: 'Cannot change your own role' }, { status: 400 })
  }

  const body = await request.json()
  const { role_id } = body

  if (!role_id) {
    return NextResponse.json({ error: 'role_id is required' }, { status: 400 })
  }

  // Verify role exists
  const { data: role, error: roleError } = await supabase
    .from('roles')
    .select('id, name')
    .eq('id', role_id)
    .single()

  if (roleError || !role) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }

  // Update user role
  const { data, error } = await supabase
    .from('users')
    .update({ role_id, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(`
      *,
      role:roles(id, name, description)
    `)
    .single()

  if (error) {
    console.error('Error updating user role:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
