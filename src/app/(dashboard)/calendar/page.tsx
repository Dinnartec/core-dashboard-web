import { LuExternalLink } from 'react-icons/lu'
import { PageContainer, PageHeader } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { CalendlyEmbed } from '@/components/calendar'

// Calendly URL - can be configured via environment variable
const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/dinnartec'

export default function CalendarPage() {
  return (
    <PageContainer>
      <PageHeader title="Calendar" description="View upcoming calls and meetings">
        <Button variant="outline" asChild>
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
            <LuExternalLink className="mr-2 h-4 w-4" />
            Open Calendly
          </a>
        </Button>
      </PageHeader>

      <CalendlyEmbed url={CALENDLY_URL} height={700} />
    </PageContainer>
  )
}
