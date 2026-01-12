import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth/options'
import { createAdminClient } from '@/lib/supabase/admin'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      // First check whitelist
      const allowedEmails = process.env.ALLOWED_EMAILS?.split(',').map((e) => e.trim()) || []

      if (!user.email || !allowedEmails.includes(user.email)) {
        return false
      }

      // Sync user to Supabase
      if (user.email && account?.provider === 'github') {
        const supabase = createAdminClient()

        // Get default member role
        const { data: memberRole } = await supabase
          .from('roles')
          .select('id')
          .eq('name', 'member')
          .single()

        if (memberRole) {
          // Upsert user
          await supabase.from('users').upsert(
            {
              id: user.id,
              email: user.email,
              username: user.email.split('@')[0],
              name: user.name || user.email.split('@')[0],
              avatar_url: user.image,
              role_id: memberRole.id,
            },
            {
              onConflict: 'email',
              ignoreDuplicates: false,
            }
          )
        }
      }

      return true
    },
  },
})
