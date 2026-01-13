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
- [x] Create all tables in Supabase (users, roles, verticals, project_statuses, projects, project_repos, project_links, team_members, solutions_metadata)
- [x] Add indexes
- [x] Configure Row Level Security (RLS) policies
- [x] Seed initial data (roles, verticals, statuses)
- [x] Create Supabase client utility

**Authentication:**
- [x] Install and configure NextAuth.js
- [x] Setup GitHub OAuth provider
- [x] Create login page UI
- [x] Implement auth middleware (protect routes)
- [x] Create user on first login (sync with Supabase)
- [x] Implement email whitelist check
- [x] Create auth context/hook for client components

### Deliverable

Users can log in with GitHub. Only whitelisted emails can access. User record created in database.

---

## Phase 2 — Layout & Navigation

**Objective:** Core layout structure and navigation working.

### Tasks

**Layout Components:**
- [x] Create `Sidebar` component (navigation items, collapsible)
- [x] Create `Header` component (logo, user menu)
- [x] Create `PageContainer` component (consistent wrapper)
- [x] Create `UserMenu` component (avatar, dropdown, logout)
- [x] Implement responsive sidebar (mobile hamburger menu)

**Base UI Components:**
- [x] Setup shadcn/ui base components (Button, Input, Select, etc.)
- [x] Create `Badge` component with status colors
- [x] Create `Card` component
- [x] Create `EmptyState` component
- [x] Create `Avatar` component

**Navigation:**
- [x] Implement sidebar navigation links
- [x] Add active state to current route
- [x] Create basic routing structure (empty pages)

### Deliverable

Authenticated users see the dashboard layout. Navigation works between empty pages. Responsive on mobile.

---

## Phase 3 — Projects Core ✅

**Objective:** Full CRUD for projects working.

### Tasks

**API Routes:**
- [x] `GET /api/projects` — List all projects
- [x] `POST /api/projects` — Create project
- [x] `GET /api/projects/[id]` — Get single project
- [x] `PATCH /api/projects/[id]` — Update project
- [x] `DELETE /api/projects/[id]` — Delete project (soft delete)
- [x] `GET /api/verticals` — List verticals
- [x] `GET /api/statuses` — List statuses

**Projects List Page:**
- [x] Create `ProjectCard` component
- [x] Create `VerticalFilter` component (tabs)
- [x] Create `StatusBadge` component
- [x] Implement projects list with data fetching
- [x] Implement filter by vertical
- [x] Implement search by name/codename
- [x] Add "New Project" button

**Create/Edit Project:**
- [x] Create project form component
- [x] Implement form validation
- [x] Create modal or page for new project
- [ ] Handle Solutions metadata (conditional fields)
- [x] Implement edit mode

**Project Detail Page:**
- [x] Create `ProjectHeader` component
- [x] Create project detail layout with tabs
- [x] Implement Overview tab (description, dates)
- [x] Wire up edit functionality

### Deliverable

Users can list, create, view, edit, and delete projects. Filter and search working.

---

## Phase 4 — Repos, Links & Team ✅

**Objective:** Manage project repos, links, and team members.

### Tasks

**API Routes:**
- [x] `GET /api/projects/[id]/repos` — List project repos
- [x] `POST /api/projects/[id]/repos` — Add repo
- [x] `DELETE /api/projects/[id]/repos?repoId=` — Remove repo
- [x] `GET /api/projects/[id]/links` — List project links
- [x] `POST /api/projects/[id]/links` — Add link
- [x] `DELETE /api/projects/[id]/links?linkId=` — Remove link
- [x] `GET /api/projects/[id]/team` — List team members
- [x] `POST /api/projects/[id]/team` — Add team member
- [x] `DELETE /api/projects/[id]/team?memberId=` — Remove member
- [x] `GET /api/users` — List users for team member selection

**Project Detail — Repos Tab:**
- [x] Create `ReposTab` component
- [x] List repos with links to GitHub
- [x] Add repo modal/form
- [x] Mark primary repo
- [x] Delete repo functionality

**Project Detail — Links Tab:**
- [x] Create `LinksTab` component
- [x] List links by type
- [x] Add link modal/form
- [x] Delete link functionality

**Project Detail — Team Tab:**
- [x] Create `TeamTab` component
- [x] List assigned members with role
- [x] Add member modal (select from users)
- [x] Set member role (lead/member)
- [x] Remove member functionality

### Deliverable

Project detail page fully functional with repos, links, and team management.

---

## Phase 5 — Home Dashboard ✅

**Objective:** Home page with overview and quick access.

### Tasks

**API Routes:**
- [x] `GET /api/dashboard/stats` — Counts per vertical
- [x] `GET /api/dashboard/recent` — Recent projects

**Home Page:**
- [x] Create vertical stats cards (count per vertical)
- [x] Create recent projects list
- [x] Add quick action "New Project"
- [x] Welcome message with user name
- [x] Link cards to filtered project list

### Deliverable

Home page shows overview of all verticals, recent activity, and quick actions.

---

## Phase 6 — Calendar Integration ✅

**Objective:** Basic calendar visibility.

### Tasks

**Option A — Calendly Embed (simpler):**
- [x] Create Calendar page
- [x] Embed Calendly scheduling widget
- [x] Add "Open Calendly" external link

**Option B — Webhook Integration (future enhancement):**
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

## Phase 7 — Settings & Permissions ✅

**Objective:** User settings and admin features.

### Tasks

**API Routes:**
- [x] `GET /api/users` — List users (admin only)
- [x] `GET /api/users/[id]` — Get single user
- [x] `PATCH /api/users/[id]` — Update user
- [x] `PATCH /api/users/[id]/role` — Change role (admin only)
- [x] `DELETE /api/users/[id]` — Deactivate user (admin only)
- [x] `GET /api/roles` — List roles

**Settings Page:**
- [x] Profile section (view name, email, username, avatar)
- [x] Edit profile (name only, email from GitHub)

**Admin Features:**
- [x] Team management section (list users, change roles)
- [x] Deactivate user
- [ ] Add user to whitelist (future enhancement)

**Permissions:**
- [x] Implement permission checks in API routes
- [x] Hide admin-only UI for non-admins
- [ ] Restrict edit to assigned projects for members (future enhancement)

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
