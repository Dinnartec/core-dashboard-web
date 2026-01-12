# Roadmap — Dinnartec Dashboard v1

## Overview

This roadmap outlines the development phases for the first functional version of the Dinnartec internal dashboard. Each phase builds upon the previous one, delivering incremental value.

**Goal:** A functional internal dashboard to manage projects across verticals with authentication and basic calendar integration.

---

## Phase 0 — Setup & Foundation

**Objective:** Project scaffolding and infrastructure ready.

### Tasks

- [x] Create repository `core-dashboard-web`
- [x] Initialize Next.js 14 project with App Router
- [x] Configure TypeScript
- [x] Install and configure Tailwind CSS
- [x] Install and configure shadcn/ui
- [x] Setup project structure (folders, base files)
- [x] Create CLAUDE.md with development guidelines
- [x] Setup ESLint and Prettier
- [ ] Create Supabase project
- [x] Configure environment variables (.env.local, .env.example)
- [ ] Create GitHub OAuth App for authentication
- [ ] Initial Vercel deployment (empty shell)

### Deliverable

Empty Next.js project deployed, connected to Supabase, ready for development.

---

## Phase 1 — Database & Auth

**Objective:** Database schema implemented and authentication working.

### Tasks

**Database:**
- [ ] Create all tables in Supabase (users, roles, verticals, project_statuses, projects, project_repos, project_links, team_members, solutions_metadata)
- [ ] Add indexes
- [ ] Configure Row Level Security (RLS) policies
- [ ] Seed initial data (roles, verticals, statuses)
- [ ] Create Supabase client utility

**Authentication:**
- [ ] Install and configure NextAuth.js
- [ ] Setup GitHub OAuth provider
- [ ] Create login page UI
- [ ] Implement auth middleware (protect routes)
- [ ] Create user on first login (sync with Supabase)
- [ ] Implement email whitelist check
- [ ] Create auth context/hook for client components

### Deliverable

Users can log in with GitHub. Only whitelisted emails can access. User record created in database.

---

## Phase 2 — Layout & Navigation

**Objective:** Core layout structure and navigation working.

### Tasks

**Layout Components:**
- [ ] Create `Sidebar` component (navigation items, collapsible)
- [ ] Create `Header` component (logo, user menu)
- [ ] Create `PageContainer` component (consistent wrapper)
- [ ] Create `UserMenu` component (avatar, dropdown, logout)
- [ ] Implement responsive sidebar (mobile hamburger menu)

**Base UI Components:**
- [ ] Setup shadcn/ui base components (Button, Input, Select, etc.)
- [ ] Create `Badge` component with status colors
- [ ] Create `Card` component
- [ ] Create `EmptyState` component
- [ ] Create `Avatar` component

**Navigation:**
- [ ] Implement sidebar navigation links
- [ ] Add active state to current route
- [ ] Create basic routing structure (empty pages)

### Deliverable

Authenticated users see the dashboard layout. Navigation works between empty pages. Responsive on mobile.

---

## Phase 3 — Projects Core

**Objective:** Full CRUD for projects working.

### Tasks

**API Routes:**
- [ ] `GET /api/projects` — List all projects
- [ ] `POST /api/projects` — Create project
- [ ] `GET /api/projects/[id]` — Get single project
- [ ] `PATCH /api/projects/[id]` — Update project
- [ ] `DELETE /api/projects/[id]` — Delete project (soft delete)
- [ ] `GET /api/verticals` — List verticals
- [ ] `GET /api/statuses` — List statuses

**Projects List Page:**
- [ ] Create `ProjectCard` component
- [ ] Create `VerticalFilter` component (tabs)
- [ ] Create `StatusBadge` component
- [ ] Implement projects list with data fetching
- [ ] Implement filter by vertical
- [ ] Implement search by name/codename
- [ ] Add "New Project" button

**Create/Edit Project:**
- [ ] Create project form component
- [ ] Implement form validation
- [ ] Create modal or page for new project
- [ ] Handle Solutions metadata (conditional fields)
- [ ] Implement edit mode

**Project Detail Page:**
- [ ] Create `ProjectHeader` component
- [ ] Create project detail layout with tabs
- [ ] Implement Overview tab (description, dates)
- [ ] Wire up edit functionality

### Deliverable

Users can list, create, view, edit, and delete projects. Filter and search working.

---

## Phase 4 — Repos, Links & Team

**Objective:** Manage project repos, links, and team members.

### Tasks

**API Routes:**
- [ ] `GET /api/projects/[id]/repos` — List project repos
- [ ] `POST /api/projects/[id]/repos` — Add repo
- [ ] `DELETE /api/projects/[id]/repos/[repoId]` — Remove repo
- [ ] `GET /api/projects/[id]/links` — List project links
- [ ] `POST /api/projects/[id]/links` — Add link
- [ ] `DELETE /api/projects/[id]/links/[linkId]` — Remove link
- [ ] `GET /api/projects/[id]/team` — List team members
- [ ] `POST /api/projects/[id]/team` — Add team member
- [ ] `DELETE /api/projects/[id]/team/[memberId]` — Remove member

**Project Detail — Repos Tab:**
- [ ] Create `RepoItem` component
- [ ] List repos with links to GitHub
- [ ] Add repo modal/form
- [ ] Mark primary repo
- [ ] Delete repo functionality

**Project Detail — Links Tab:**
- [ ] Create `LinkItem` component
- [ ] List links by type
- [ ] Add link modal/form
- [ ] Delete link functionality

**Project Detail — Team Tab:**
- [ ] Create `TeamMember` component
- [ ] List assigned members with role
- [ ] Add member modal (select from users)
- [ ] Set member role (lead/member)
- [ ] Remove member functionality

### Deliverable

Project detail page fully functional with repos, links, and team management.

---

## Phase 5 — Home Dashboard

**Objective:** Home page with overview and quick access.

### Tasks

**API Routes:**
- [ ] `GET /api/dashboard/stats` — Counts per vertical
- [ ] `GET /api/dashboard/recent` — Recent projects

**Home Page:**
- [ ] Create vertical stats cards (count per vertical)
- [ ] Create recent projects list
- [ ] Add quick action "New Project"
- [ ] Welcome message with user name
- [ ] Link cards to filtered project list

### Deliverable

Home page shows overview of all verticals, recent activity, and quick actions.

---

## Phase 6 — Calendar Integration

**Objective:** Basic calendar visibility.

### Tasks

**Option A — Calendly Embed (simpler):**
- [ ] Create Calendar page
- [ ] Embed Calendly scheduling widget
- [ ] Add "Open Calendly" external link

**Option B — Webhook Integration (if time permits):**
- [ ] Create `calendar_events` table
- [ ] Setup Calendly webhook endpoint
- [ ] `POST /api/webhooks/calendly` — Receive events
- [ ] `GET /api/calendar/events` — List events
- [ ] Create `EventCard` component
- [ ] Display upcoming/past events list
- [ ] Link events to projects (optional)

### Deliverable

Users can view upcoming calls, either via embed or native list.

---

## Phase 7 — Settings & Permissions

**Objective:** User settings and admin features.

### Tasks

**API Routes:**
- [ ] `GET /api/users` — List users (admin only)
- [ ] `PATCH /api/users/[id]` — Update user
- [ ] `PATCH /api/users/[id]/role` — Change role (admin only)

**Settings Page:**
- [ ] Profile section (view name, email, username)
- [ ] Edit profile (name only, email from GitHub)

**Admin Features:**
- [ ] Team management section (list users, change roles)
- [ ] Add user to whitelist
- [ ] Deactivate user

**Permissions:**
- [ ] Implement permission checks in API routes
- [ ] Hide admin-only UI for non-admins
- [ ] Restrict edit to assigned projects for members

### Deliverable

Settings page functional. Admins can manage team. Permissions enforced.

---

## Phase 8 — Polish & Launch

**Objective:** Production-ready release.

### Tasks

**Testing:**
- [ ] Test all CRUD operations
- [ ] Test permissions for each role
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Test auth flow (login, logout, unauthorized access)
- [ ] Fix bugs found during testing

**Polish:**
- [ ] Add loading states to all async operations
- [ ] Add error handling and user-friendly messages
- [ ] Add confirmation dialogs for destructive actions
- [ ] Ensure consistent styling across all pages
- [ ] Optimize performance (lazy loading, caching)

**Documentation:**
- [ ] Update CLAUDE.md with final patterns
- [ ] Document environment variables needed
- [ ] Create README with setup instructions

**Deployment:**
- [ ] Configure production environment variables
- [ ] Setup production Supabase (if separate from dev)
- [ ] Final Vercel deployment
- [ ] Configure custom domain (if applicable)
- [ ] Smoke test production

### Deliverable

Dashboard v1 live and usable by the team.

---

## Summary

| Phase | Objective | Key Deliverable |
|-------|-----------|-----------------|
| 0 | Setup & Foundation | Project scaffolded, deployed |
| 1 | Database & Auth | Login working, DB ready |
| 2 | Layout & Navigation | UI shell complete |
| 3 | Projects Core | Full project CRUD |
| 4 | Repos, Links & Team | Project details complete |
| 5 | Home Dashboard | Overview page ready |
| 6 | Calendar Integration | Calendar visibility |
| 7 | Settings & Permissions | Admin features, permissions |
| 8 | Polish & Launch | Production release |

---

## Out of Scope (v2+)

- Activity logs / audit trail
- Project milestones and tasks
- GitHub auto-sync (commits, PRs)
- Time tracking
- Revenue dashboard
- Notifications
- Dark mode

---

*Roadmap version: 1.0 — January 2026*
