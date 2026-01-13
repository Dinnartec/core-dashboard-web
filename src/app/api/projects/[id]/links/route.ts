import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createAdminClient } from '@/lib/supabase/admin'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/projects/[id]/links - List project links
export async function GET(request: Request, { params }: RouteParams) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('project_links')
    .select('*')
    .eq('project_id', id)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching links:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST /api/projects/[id]/links - Add a link
export async function POST(request: Request, { params }: RouteParams) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const { label, url, type } = body

  if (!label || !url) {
    return NextResponse.json(
      { error: 'Label and URL are required' },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('project_links')
    .insert({
      project_id: id,
      label,
      url,
      type: type || null,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating link:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}

// DELETE /api/projects/[id]/links - Delete a link
export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const { searchParams } = new URL(request.url)
  const linkId = searchParams.get('linkId')

  if (!linkId) {
    return NextResponse.json({ error: 'linkId is required' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { error } = await supabase
    .from('project_links')
    .delete()
    .eq('id', linkId)
    .eq('project_id', id)

  if (error) {
    console.error('Error deleting link:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
