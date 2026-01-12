import { auth } from '@/auth'
import { PageContainer, PageHeader } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default async function SettingsPage() {
  const session = await auth()
  const user = session?.user

  return (
    <PageContainer>
      <PageHeader title="Settings" description="Manage your account and preferences" />

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your personal information from GitHub</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1">
            <p className="text-sm font-medium">Name</p>
            <p className="text-sm text-muted-foreground">{user?.name}</p>
          </div>
          <Separator />
          <div className="grid gap-1">
            <p className="text-sm font-medium">Email</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </CardContent>
      </Card>

      {/* Team Section - Admin only, will be implemented in Phase 7 */}
      <Card>
        <CardHeader>
          <CardTitle>Team</CardTitle>
          <CardDescription>Manage team members and roles</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Team management coming soon.</p>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
