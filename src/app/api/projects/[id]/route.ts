import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createAdminClient } from '@/lib/supabase/admin'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/projects/[id] - Get a single project
export async function GET(request: Request, { params }: RouteParams) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      vertical:verticals(*),
      status:project_statuses(*),
      repos:project_repos(*),
      links:project_links(*),
      team:team_members(*, user:users(*))
    `)
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    console.error('Error fetching project:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// PATCH /api/projects/[id] - Update a project
export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const { name, codename, vertical_id, status_id, description, started_at, launched_at } = body

  const supabase = createAdminClient()

  // If codename is being updated, validate format and uniqueness
  if (codename) {
    const codenameRegex = /^[a-z0-9-]+$/
    if (!codenameRegex.test(codename)) {
      return NextResponse.json(
        { error: 'Codename must be lowercase letters, numbers, and hyphens only' },
        { status: 400 }
      )
    }

    // Check if codename already exists (excluding current project)
    const { data: existingProject } = await supabase
      .from('projects')
      .select('id')
      .eq('codename', codename)
      .neq('id', id)
      .single()

    if (existingProject) {
      return NextResponse.json(
        { error: 'A project with this codename already exists' },
        { status: 400 }
      )
    }
  }

  // Build update object with only provided fields
  const updateData: Record<string, unknown> = {}
  if (name !== undefined) updateData.name = name
  if (codename !== undefined) updateData.codename = codename
  if (vertical_id !== undefined) updateData.vertical_id = vertical_id
  if (status_id !== undefined) updateData.status_id = status_id
  if (description !== undefined) updateData.description = description
  if (started_at !== undefined) updateData.started_at = started_at
  if (launched_at !== undefined) updateData.launched_at = launched_at

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', id)
    .eq('is_active', true)
    .select(`
      *,
      vertical:verticals(*),
      status:project_statuses(*)
    `)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    console.error('Error updating project:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// DELETE /api/projects/[id] - Soft delete a project
export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const supabase = createAdminClient()

  // Soft delete by setting is_active to false
  const { error } = await supabase
    .from('projects')
    .update({ is_active: false })
    .eq('id', id)
    .eq('is_active', true)

  if (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
