'use client'

import { cn } from '@/lib/utils'
import type { VerticalRecord } from '@/types'

interface VerticalFilterProps {
  verticals: VerticalRecord[]
  selected: string
  onChange: (vertical: string) => void
  className?: string
}

export function VerticalFilter({ verticals, selected, onChange, className }: VerticalFilterProps) {
  return (
    <div className={cn('flex items-center gap-1 border-b', className)}>
      <button
        onClick={() => onChange('all')}
        className={cn(
          'px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px',
          selected === 'all'
            ? 'border-foreground text-foreground'
            : 'border-transparent text-muted-foreground hover:text-foreground'
        )}
      >
        All
      </button>
      {verticals.map((vertical) => (
        <button
          key={vertical.id}
          onClick={() => onChange(vertical.slug)}
          className={cn(
            'px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px',
            selected === vertical.slug
              ? 'border-foreground text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          {vertical.name}
        </button>
      ))}
    </div>
  )
}
