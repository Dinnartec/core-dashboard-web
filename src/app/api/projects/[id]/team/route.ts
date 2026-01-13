import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createAdminClient } from '@/lib/supabase/admin'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/projects/[id]/team - List team members
export async function GET(request: Request, { params }: RouteParams) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('team_members')
    .select('*, user:users(*)')
    .eq('project_id', id)
    .order('role', { ascending: true })
    .order('assigned_at', { ascending: true })

  if (error) {
    console.error('Error fetching team:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST /api/projects/[id]/team - Add a team member
export async function POST(request: Request, { params }: RouteParams) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const { user_id, role } = body

  if (!user_id) {
    return NextResponse.json(
      { error: 'user_id is required' },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()

  // Check if user is already a member
  const { data: existing } = await supabase
    .from('team_members')
    .select('id')
    .eq('project_id', id)
    .eq('user_id', user_id)
    .single()

  if (existing) {
    return NextResponse.json(
      { error: 'User is already a team member' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('team_members')
    .insert({
      project_id: id,
      user_id,
      role: role || 'member',
    })
    .select('*, user:users(*)')
    .single()

  if (error) {
    console.error('Error adding team member:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}

// DELETE /api/projects/[id]/team - Remove a team member
export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const { searchParams } = new URL(request.url)
  const memberId = searchParams.get('memberId')

  if (!memberId) {
    return NextResponse.json({ error: 'memberId is required' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', memberId)
    .eq('project_id', id)

  if (error) {
    console.error('Error removing team member:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
