# CLAUDE.md — Dinnartec Dashboard

## Project Overview

Internal dashboard for Dinnartec team to manage projects across verticals, track team assignments, and view calendar events.

**Codename:** `core-dashboard-web`
**Type:** Internal tool
**Auth:** Required (GitHub OAuth)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| UI Components | shadcn/ui |
| Styling | Tailwind CSS |
| Icons | React Icons |
| Auth | NextAuth.js (GitHub provider) |
| Database | Supabase (PostgreSQL) |
| Hosting | Vercel |

---

## Design Reference

For design patterns, styling, and UI consistency, refer to `core-landing-web`.

**Key principles:**
- Black and white color palette
- Inter font family
- Minimal, modern, serious aesthetic
- Consistent spacing and typography
- shadcn/ui components as base

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Home
│   │   ├── projects/
│   │   │   ├── page.tsx                # Projects list
│   │   │   ├── new/
│   │   │   │   └── page.tsx            # New project
│   │   │   └── [codename]/
│   │   │       └── page.tsx            # Project detail
│   │   ├── calendar/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── projects/
│   │   │   ├── route.ts                # GET, POST
│   │   │   └── [id]/
│   │   │       ├── route.ts            # GET, PATCH, DELETE
│   │   │       ├── repos/
│   │   │       │   └── route.ts
│   │   │       ├── links/
│   │   │       │   └── route.ts
│   │   │       └── team/
│   │   │           └── route.ts
│   │   ├── users/
│   │   │   └── route.ts
│   │   ├── verticals/
│   │   │   └── route.ts
│   │   └── calendar/
│   │       └── events/
│   │           └── route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                             # shadcn/ui components
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── PageContainer.tsx
│   │   └── UserMenu.tsx
│   ├── projects/
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectHeader.tsx
│   │   ├── ProjectForm.tsx
│   │   ├── RepoItem.tsx
│   │   ├── LinkItem.tsx
│   │   ├── TeamMember.tsx
│   │   ├── VerticalFilter.tsx
│   │   └── StatusBadge.tsx
│   └── calendar/
│       └── EventCard.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                   # Browser client
│   │   ├── server.ts                   # Server client
│   │   └── admin.ts                    # Admin client (service role)
│   ├── auth/
│   │   ├── options.ts                  # NextAuth config
│   │   └── utils.ts                    # Auth helpers
│   ├── utils.ts                        # General utilities
│   └── constants.ts                    # App constants
├── hooks/
│   ├── useProjects.ts
│   ├── useProject.ts
│   └── useUser.ts
├── types/
│   ├── database.ts                     # Supabase generated types
│   ├── project.ts
│   ├── user.ts
│   └── index.ts
└── styles/
    └── globals.css
```

---

## Architecture Principles

### 1. Server vs Client Components

**Server Components (default):**
- Pages that fetch data
- Static layouts
- Components without interactivity

**Client Components (`"use client"`):**
- Forms and inputs
- Interactive elements (dropdowns, modals)
- Components using hooks (useState, useEffect)
- Components using browser APIs

### 2. Data Fetching

**Server Components:**
```typescript
async function ProjectsPage() {
  const projects = await getProjects()
  return <ProjectList projects={projects} />
}
```

**Client Components (mutations):**
```typescript
const { mutate } = useSWR('/api/projects')

async function handleCreate(data: ProjectInput) {
  await fetch('/api/projects', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  mutate()
}
```

### 3. API Routes

All API routes follow this pattern:

```typescript
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient()
  const { data, error } = await supabase.from('projects').select('*')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
```

### 4. Error Handling

**API Routes:**
- Always return proper status codes
- Return consistent error shape: `{ error: string }`
- Log errors server-side

**Client:**
- Show user-friendly error messages
- Use toast notifications for errors
- Provide retry options where appropriate

---

## Component Guidelines

### Structure

```
ComponentName/
├── index.ts
├── ComponentName.tsx
└── ComponentName.types.ts      # If complex props
```

Or single file for simple components:
```
ComponentName.tsx
```

### Pattern

```typescript
import { cn } from '@/lib/utils'

interface ProjectCardProps {
  project: Project
  className?: string
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <div className={cn('border rounded-lg p-4', className)}>
      {/* content */}
    </div>
  )
}
```

### Rules

- Use functional components with TypeScript
- Define explicit prop types
- Accept `className` prop for style overrides
- Use `cn()` utility for conditional classes
- Keep components focused (< 150 lines)
- Extract sub-components when needed

---

## Naming Conventions

### Files and Folders

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ProjectCard.tsx` |
| Pages | lowercase | `page.tsx` |
| API routes | lowercase | `route.ts` |
| Utilities | camelCase | `formatDate.ts` |
| Hooks | camelCase with 'use' | `useProjects.ts` |
| Types | PascalCase | `Project`, `UserRole` |
| Constants | UPPER_SNAKE | `API_BASE_URL` |

### Database

| Type | Convention | Example |
|------|------------|---------|
| Tables | snake_case plural | `projects`, `team_members` |
| Columns | snake_case | `created_at`, `client_name` |
| Foreign keys | singular_id | `project_id`, `user_id` |

### API Routes

| Method | Action | Example |
|--------|--------|---------|
| GET | List/Read | `GET /api/projects` |
| POST | Create | `POST /api/projects` |
| PATCH | Update | `PATCH /api/projects/[id]` |
| DELETE | Delete | `DELETE /api/projects/[id]` |

---

## Styling

### Design Tokens

```css
:root {
  --background: #FFFFFF;
  --foreground: #000000;
  --muted: #666666;
  --border: #E5E5E5;
  --hover: #F5F5F5;
  
  --status-planning: #6B7280;
  --status-in-progress: #3B82F6;
  --status-paused: #F59E0B;
  --status-launched: #10B981;
  --status-archived: #9CA3AF;
}
```

### Tailwind Class Order

1. Layout (flex, grid, position)
2. Spacing (margin, padding, gap)
3. Sizing (width, height)
4. Typography (font, text)
5. Colors (bg, text, border)
6. Effects (shadow, opacity, transition)

### Responsive Breakpoints

```
Mobile: < 768px (default)
Tablet: >= 768px (md:)
Desktop: >= 1024px (lg:)
Large: >= 1280px (xl:)
```

---

## Authentication

### Protected Routes

All routes under `(dashboard)` require authentication:

```typescript
// app/(dashboard)/layout.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  return <>{children}</>
}
```

### Getting Current User

**Server:**
```typescript
const session = await getServerSession(authOptions)
const userId = session?.user?.id
```

**Client:**
```typescript
import { useSession } from 'next-auth/react'

function Component() {
  const { data: session } = useSession()
  const user = session?.user
}
```

### Permission Checks

```typescript
import { checkPermission } from '@/lib/auth/utils'

// In API route
if (!checkPermission(session.user, 'projects:delete')) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

---

## Database

### Supabase Clients

**Browser (client components):**
```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
```

**Server (server components, API routes):**
```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = createClient()
```

**Admin (bypass RLS):**
```typescript
import { createAdminClient } from '@/lib/supabase/admin'

const supabase = createAdminClient()
```

### Query Patterns

**List with relations:**
```typescript
const { data } = await supabase
  .from('projects')
  .select(`
    *,
    vertical:verticals(*),
    status:project_statuses(*),
    repos:project_repos(*),
    team:team_members(*, user:users(*))
  `)
  .eq('is_active', true)
  .order('updated_at', { ascending: false })
```

**Single with relations:**
```typescript
const { data } = await supabase
  .from('projects')
  .select(`*, vertical:verticals(*), status:project_statuses(*)`)
  .eq('codename', codename)
  .single()
```

---

## Forms

### Pattern with React Hook Form

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { projectSchema, ProjectInput } from '@/types/project'

export function ProjectForm({ onSubmit }: { onSubmit: (data: ProjectInput) => void }) {
  const form = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      codename: '',
      vertical_id: '',
      status_id: ''
    }
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* form fields */}
    </form>
  )
}
```

### Validation with Zod

```typescript
import { z } from 'zod'

export const projectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  codename: z.string().min(1, 'Codename is required').regex(/^[a-z0-9-]+$/, 'Lowercase, numbers, hyphens only'),
  vertical_id: z.string().uuid('Select a vertical'),
  status_id: z.string().uuid('Select a status'),
  description: z.string().optional()
})

export type ProjectInput = z.infer<typeof projectSchema>
```

---

## State Management

### Server State (SWR)

```typescript
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useProjects() {
  const { data, error, isLoading, mutate } = useSWR('/api/projects', fetcher)
  
  return {
    projects: data,
    isLoading,
    isError: error,
    refresh: mutate
  }
}
```

### Client State

Use React's built-in state for UI state:
- `useState` for simple state
- `useReducer` for complex state
- Context only when truly needed (avoid prop drilling)

---

## Environment Variables

```bash
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

# GitHub OAuth
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Allowed emails (comma-separated)
ALLOWED_EMAILS=nico@example.com,partner@example.com
```

---

## Git Conventions

### Branches

```
main              → Production
develop           → Development (if needed)
feature/*         → New features
fix/*             → Bug fixes
refactor/*        → Code improvements
```

### Commits

```
feat: add project creation form
fix: sidebar not collapsing on mobile
refactor: extract ProjectCard component
style: adjust spacing in project list
docs: update README with setup instructions
chore: update dependencies
```

---

## Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Run Prettier
npm run db:types     # Generate Supabase types
```

---

## Pre-commit Checklist

- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] No console.log statements
- [ ] Loading states implemented
- [ ] Error states handled
- [ ] Responsive design tested
- [ ] Permissions checked (if applicable)

---

## Related Documents

- `CONTEXT.md` — Company's context
- `DASHBOARD_DEFINITION.md` — Feature specs and wireframes
- `DB_SCHEMA.md` — Database structure
- `ROADMAP.md` — Development phases

---

*Document version: 1.0 — January 2026*
