'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { VerticalRecord, StatusRecord, ProjectWithRelations } from '@/types'

const projectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  codename: z
    .string()
    .min(1, 'Codename is required')
    .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, and hyphens only'),
  vertical_id: z.string().min(1, 'Select a vertical'),
  status_id: z.string().min(1, 'Select a status'),
  description: z.string().optional(),
  started_at: z.string().optional(),
})

type ProjectFormData = z.infer<typeof projectSchema>

interface ProjectFormProps {
  verticals: VerticalRecord[]
  statuses: StatusRecord[]
  project?: ProjectWithRelations
  mode?: 'create' | 'edit'
}

export function ProjectForm({ verticals, statuses, project, mode = 'create' }: ProjectFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name || '',
      codename: project?.codename || '',
      vertical_id: project?.vertical_id || '',
      status_id: project?.status_id || '',
      description: project?.description || '',
      started_at: project?.started_at || '',
    },
  })

  const watchName = watch('name')

  const generateCodename = () => {
    if (watchName && mode === 'create') {
      const codename = watchName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setValue('codename', codename)
    }
  }

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const url = mode === 'edit' ? `/api/projects/${project?.id}` : '/api/projects'
      const method = mode === 'edit' ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Something went wrong')
        return
      }

      router.push(`/projects/${result.codename}`)
      router.refresh()
    } catch {
      setError('Failed to save project')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            placeholder="My Awesome Project"
            {...register('name')}
            onBlur={generateCodename}
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="codename">Codename *</Label>
          <Input
            id="codename"
            placeholder="my-awesome-project"
            {...register('codename')}
            disabled={mode === 'edit'}
          />
          {errors.codename && (
            <p className="text-sm text-red-600">{errors.codename.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Used in URLs and as internal identifier
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Vertical *</Label>
            <Controller
              name="vertical_id"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select vertical" />
                  </SelectTrigger>
                  <SelectContent>
                    {verticals.map((vertical) => (
                      <SelectItem key={vertical.id} value={vertical.id}>
                        {vertical.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.vertical_id && (
              <p className="text-sm text-red-600">{errors.vertical_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Status *</Label>
            <Controller
              name="status_id"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.id} value={status.id}>
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status_id && (
              <p className="text-sm text-red-600">{errors.status_id.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Brief description of the project..."
            rows={3}
            {...register('description')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="started_at">Start Date</Label>
          <Input id="started_at" type="date" {...register('started_at')} />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Create Project'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
