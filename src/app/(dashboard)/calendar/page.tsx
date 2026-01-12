import { LuCalendarDays, LuExternalLink } from 'react-icons/lu'
import { PageContainer, PageHeader } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'

export default function CalendarPage() {
  return (
    <PageContainer>
      <PageHeader title="Calendar" description="View upcoming calls and meetings">
        <Button variant="outline" asChild>
          <a href="https://calendly.com" target="_blank" rel="noopener noreferrer">
            <LuExternalLink className="mr-2 h-4 w-4" />
            Open Calendly
          </a>
        </Button>
      </PageHeader>

      {/* Calendar integration will be implemented in Phase 6 */}
      <EmptyState
        icon={<LuCalendarDays className="h-12 w-12" />}
        title="No upcoming events"
        description="Calendar integration coming soon."
      />
    </PageContainer>
  )
}
