import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createAdminClient } from '@/lib/supabase/admin'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/users/[id] - Get single user
export async function GET(request: Request, { params }: RouteParams) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      role:roles(id, name, description)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}

// PATCH /api/users/[id] - Update user profile
export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const supabase = createAdminClient()

  // Users can only update their own profile, unless they're admin
  const { data: currentUser } = await supabase
    .from('users')
    .select('id, role:roles(name)')
    .eq('id', session.user.id)
    .single()

  const role = currentUser?.role as { name: string } | { name: string }[] | null
  const isAdmin = Array.isArray(role)
    ? role[0]?.name === 'admin'
    : role?.name === 'admin'

  if (currentUser?.id !== id && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()

  // Only allow updating name (email comes from GitHub)
  const updateData: { name?: string; updated_at: string } = {
    updated_at: new Date().toISOString(),
  }

  if (body.name && typeof body.name === 'string') {
    updateData.name = body.name.trim()
  }

  const { data, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// DELETE /api/users/[id] - Deactivate user (admin only)
export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const supabase = createAdminClient()

  // Check if current user is admin
  const { data: adminCheck } = await supabase
    .from('users')
    .select('role:roles(name)')
    .eq('id', session.user.id)
    .single()

  const adminRole = adminCheck?.role as { name: string } | { name: string }[] | null
  const isUserAdmin = Array.isArray(adminRole)
    ? adminRole[0]?.name === 'admin'
    : adminRole?.name === 'admin'

  if (!isUserAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Prevent self-deactivation
  if (id === session.user.id) {
    return NextResponse.json({ error: 'Cannot deactivate yourself' }, { status: 400 })
  }

  // Soft delete (deactivate)
  const { error } = await supabase
    .from('users')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('Error deactivating user:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
