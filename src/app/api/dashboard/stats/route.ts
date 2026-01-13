import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/dashboard/stats - Get project counts per vertical
export async function GET() {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  // Get all verticals
  const { data: verticals, error: verticalsError } = await supabase
    .from('verticals')
    .select('id, slug, name')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (verticalsError) {
    console.error('Error fetching verticals:', verticalsError)
    return NextResponse.json({ error: verticalsError.message }, { status: 500 })
  }

  // Get project counts per vertical
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('vertical_id')
    .eq('is_active', true)

  if (projectsError) {
    console.error('Error fetching projects:', projectsError)
    return NextResponse.json({ error: projectsError.message }, { status: 500 })
  }

  // Count projects per vertical
  const counts: Record<string, number> = {}
  projects.forEach((project) => {
    counts[project.vertical_id] = (counts[project.vertical_id] || 0) + 1
  })

  // Build stats response
  const stats = verticals.map((vertical) => ({
    id: vertical.id,
    slug: vertical.slug,
    name: vertical.name,
    count: counts[vertical.id] || 0,
  }))

  return NextResponse.json(stats)
}
