import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/users - List all active users
export async function GET() {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
