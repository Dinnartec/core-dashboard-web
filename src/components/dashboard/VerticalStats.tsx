import { VerticalStatsCard } from './VerticalStatsCard'

interface VerticalStat {
  id: string
  slug: string
  name: string
  count: number
}

interface VerticalStatsProps {
  stats: VerticalStat[]
}

export function VerticalStats({ stats }: VerticalStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <VerticalStatsCard key={stat.id} stat={stat} />
      ))}
    </div>
  )
}
