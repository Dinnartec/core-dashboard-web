import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createAdminClient } from '@/lib/supabase/admin'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/projects/[id]/repos - List project repos
export async function GET(request: Request, { params }: RouteParams) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('project_repos')
    .select('*')
    .eq('project_id', id)
    .order('is_primary', { ascending: false })
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching repos:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST /api/projects/[id]/repos - Add a repo
export async function POST(request: Request, { params }: RouteParams) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const { name, url, type, is_primary } = body

  if (!name || !url) {
    return NextResponse.json(
      { error: 'Name and URL are required' },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()

  // If this is marked as primary, unmark other repos
  if (is_primary) {
    await supabase
      .from('project_repos')
      .update({ is_primary: false })
      .eq('project_id', id)
  }

  const { data, error } = await supabase
    .from('project_repos')
    .insert({
      project_id: id,
      name,
      url,
      type: type || null,
      is_primary: is_primary || false,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating repo:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}

// DELETE /api/projects/[id]/repos - Delete a repo (with repoId in body)
export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const { searchParams } = new URL(request.url)
  const repoId = searchParams.get('repoId')

  if (!repoId) {
    return NextResponse.json({ error: 'repoId is required' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { error } = await supabase
    .from('project_repos')
    .delete()
    .eq('id', repoId)
    .eq('project_id', id)

  if (error) {
    console.error('Error deleting repo:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
