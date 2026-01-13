import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/projects - List all projects
export async function GET(request: Request) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const vertical = searchParams.get('vertical')
  const search = searchParams.get('search')

  const supabase = createAdminClient()

  let query = supabase
    .from('projects')
    .select(`
      *,
      vertical:verticals(*),
      status:project_statuses(*),
      team:team_members(*, user:users(*))
    `)
    .eq('is_active', true)
    .order('updated_at', { ascending: false })

  // Filter by vertical
  if (vertical && vertical !== 'all') {
    const { data: verticalData } = await supabase
      .from('verticals')
      .select('id')
      .eq('slug', vertical)
      .single()

    if (verticalData) {
      query = query.eq('vertical_id', verticalData.id)
    }
  }

  // Search by name or codename
  if (search) {
    query = query.or(`name.ilike.%${search}%,codename.ilike.%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST /api/projects - Create a new project
export async function POST(request: Request) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, codename, vertical_id, status_id, description, started_at } = body

  // Validate required fields
  if (!name || !codename || !vertical_id || !status_id) {
    return NextResponse.json(
      { error: 'Missing required fields: name, codename, vertical_id, status_id' },
      { status: 400 }
    )
  }

  // Validate codename format (lowercase, numbers, hyphens only)
  const codenameRegex = /^[a-z0-9-]+$/
  if (!codenameRegex.test(codename)) {
    return NextResponse.json(
      { error: 'Codename must be lowercase letters, numbers, and hyphens only' },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()

  // Check if codename already exists
  const { data: existingProject } = await supabase
    .from('projects')
    .select('id')
    .eq('codename', codename)
    .single()

  if (existingProject) {
    return NextResponse.json(
      { error: 'A project with this codename already exists' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({
      name,
      codename,
      vertical_id,
      status_id,
      description: description || null,
      started_at: started_at || null,
    })
    .select(`
      *,
      vertical:verticals(*),
      status:project_statuses(*)
    `)
    .single()

  if (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
