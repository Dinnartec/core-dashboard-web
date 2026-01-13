import { PageContainer, PageHeader } from '@/components/layout'
import { ProfileSection, TeamManagement } from '@/components/settings'
import { getCurrentUserWithRole, isCurrentUserAdmin } from '@/lib/auth/utils'

export default async function SettingsPage() {
  const [user, isAdmin] = await Promise.all([
    getCurrentUserWithRole(),
    isCurrentUserAdmin(),
  ])

  if (!user) {
    return (
      <PageContainer>
        <PageHeader title="Settings" description="Manage your account and preferences" />
        <p className="text-muted-foreground">Unable to load user data.</p>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader title="Settings" description="Manage your account and preferences" />

      <div className="space-y-6">
        <ProfileSection user={user} />

        {isAdmin && <TeamManagement currentUserId={user.id} />}
      </div>
    </PageContainer>
  )
}
