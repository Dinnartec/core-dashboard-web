'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

interface VerticalStat {
  id: string
  slug: string
  name: string
  count: number
}

interface VerticalStatsCardProps {
  stat: VerticalStat
}

export function VerticalStatsCard({ stat }: VerticalStatsCardProps) {
  return (
    <Link href={`/projects?vertical=${stat.slug}`}>
      <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{stat.count}</div>
          <p className="text-sm text-muted-foreground">{stat.name}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
