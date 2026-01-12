import { cn } from '@/lib/utils'

type Status = 'planning' | 'in_progress' | 'paused' | 'launched' | 'archived'

interface StatusBadgeProps {
  status: Status
  className?: string
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  planning: {
    label: 'Planning',
    className: 'bg-gray-100 text-gray-700',
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-blue-100 text-blue-700',
  },
  paused: {
    label: 'Paused',
    className: 'bg-amber-100 text-amber-700',
  },
  launched: {
    label: 'Launched',
    className: 'bg-green-100 text-green-700',
  },
  archived: {
    label: 'Archived',
    className: 'bg-gray-100 text-gray-500',
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
