import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/dashboard/recent - Get recent projects
export async function GET() {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('projects')
    .select(`
      id,
      name,
      codename,
      updated_at,
      vertical:verticals(slug, name),
      status:project_statuses(slug, name)
    `)
    .eq('is_active', true)
    .order('updated_at', { ascending: false })
    .limit(5)

  if (error) {
    console.error('Error fetching recent projects:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
