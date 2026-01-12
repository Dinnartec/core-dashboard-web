# Dashboard Definition — Dinnartec

## Overview

- **Project:** Internal dashboard for Dinnartec team
- **Codename:** `core-dashboard-web`
- **Purpose:** Visualize project status across verticals, manage team assignments, and track calendar events
- **Users:** Founders initially, then extended team
- **Auth:** Required (GitHub OAuth)
- **Style:** Minimal, modern, serious — consistent with `core-landing-web`
- **Colors:** Black and white only

---

## Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Framework | Next.js 14 | App Router, Server Components |
| UI Components | shadcn/ui | Consistent with landing |
| Styling | Tailwind CSS | B&W palette |
| Icons | React Icons | Same as landing |
| Auth | NextAuth.js | GitHub OAuth provider |
| Database | Supabase | PostgreSQL + RLS |
| Hosting | Vercel | TBD |

---

## Design System

### Colors

```css
--color-background: #FFFFFF;
--color-foreground: #000000;
--color-muted: #666666;
--color-border: #E5E5E5;
--color-hover: #F5F5F5;
--color-active: #000000;
```

### Status Colors (exceptions to B&W)

```css
--color-status-planning: #6B7280;    /* Gray */
--color-status-in-progress: #3B82F6; /* Blue */
--color-status-paused: #F59E0B;      /* Amber */
--color-status-launched: #10B981;    /* Green */
--color-status-archived: #9CA3AF;    /* Light gray */
```

### Typography

- **Font:** Inter (same as landing)
- **Headings:** Bold, black
- **Body:** Regular, black or muted
- **Monospace:** For codenames, technical info

### Spacing

- Consistent with landing
- Comfortable padding in cards and sections
- Clear visual hierarchy

---

## Structure

### Layout

```
┌─────────────────────────────────────────────────────────┐
│ Header                                        User Menu │
├────────────┬────────────────────────────────────────────┤
│            │                                            │
│  Sidebar   │              Main Content                  │
│            │                                            │
│  - Home    │                                            │
│  - Projects│                                            │
│  - Calendar│                                            │
│  - Settings│                                            │
│            │                                            │
└────────────┴────────────────────────────────────────────┘
```

### Navigation

**Sidebar (collapsible on mobile):**

| Icon | Label | Route |
|------|-------|-------|
| Home | Home | `/` |
| Folder | Projects | `/projects` |
| Calendar | Calendar | `/calendar` |
| Settings | Settings | `/settings` |

**Header:**

- Logo: "Dinnartec" text (links to home)
- User menu: Avatar, name, logout

---

## Pages & Features

### 1. Login Page (`/login`)

**Content:**
- Dinnartec logo
- "Sign in to continue"
- GitHub OAuth button
- Minimal, centered layout

**Behavior:**
- Redirect to home if already authenticated
- Only whitelisted emails can access

---

### 2. Home / Dashboard (`/`)

**Content:**

```
Welcome back, [Name]

[Overview Cards]
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Core         │ │ Solutions    │ │ Factory      │ │ Labs         │
│ 2 projects   │ │ 0 projects   │ │ 1 project    │ │ 0 projects   │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘

[Recent Projects]
- quest (Factory) — In Progress
- dashboard (Core) — In Progress
- landing (Core) — Launched

[Upcoming Calls]
- No upcoming calls (or list from Calendly)
```

**Features:**
- Quick stats per vertical
- Recent/active projects list
- Upcoming calendar events
- Quick action: "New Project" button

---

### 3. Projects List (`/projects`)

**Content:**

```
Projects                                    [+ New Project]

[Filter Tabs: All | Core | Solutions | Factory | Labs]
[Search input]

┌─────────────────────────────────────────────────────────┐
│ ● quest                                    In Progress  │
│   Factory · Gamified travel platform                    │
│   @nico, @partner · Updated 2 days ago                  │
├─────────────────────────────────────────────────────────┤
│ ● dashboard                                In Progress  │
│   Core · Internal team dashboard                        │
│   @nico · Updated today                                 │
├─────────────────────────────────────────────────────────┤
│ ● landing                                    Launched   │
│   Core · Main Dinnartec website                         │
│   @nico, @partner · Updated 1 week ago                  │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Filter by vertical (tabs)
- Search by name or codename
- Sort by: recent, name, status
- Click to open project detail
- Status badge with color

---

### 4. Project Detail (`/projects/[codename]`)

**Content:**

```
← Back to Projects

quest                                         [Edit] [...]
Factory · In Progress
Gamified travel platform

[Tabs: Overview | Repos | Links | Team]

─── Overview ───────────────────────────────────────────────

Description:
A gamified travel platform focused on Colombia, turning 
real-world exploration into missions and achievements.

Started: January 2025
Launched: —

─── Repos ──────────────────────────────────────────────────

┌─────────────────────────────────────────────────────────┐
│ factory-quest-web          ★ Primary                    │
│ github.com/dinnartec/factory-quest-web                  │
├─────────────────────────────────────────────────────────┤
│ factory-quest-api                                       │
│ github.com/dinnartec/factory-quest-api                  │
└─────────────────────────────────────────────────────────┘

[+ Add Repo]

─── Links ──────────────────────────────────────────────────

Production: https://quest.dinnartec.com
Staging: https://staging.quest.dinnartec.com
Figma: https://figma.com/...

[+ Add Link]

─── Team ───────────────────────────────────────────────────

@nico (Lead)
@partner (Member)

[+ Add Member]
```

**Features:**
- Project header with status
- Tabbed content organization
- Edit project details inline or modal
- Manage repos, links, team members
- Quick links to GitHub repos

---

### 5. New/Edit Project (`/projects/new` or modal)

**Form Fields:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Name | text | yes | Commercial/public name |
| Codename | text | yes | Internal identifier, auto-slug |
| Vertical | select | yes | Core, Solutions, Factory, Labs |
| Status | select | yes | Default: Planning |
| Description | textarea | no | |
| Started at | date | no | |

**For Solutions projects (conditional):**

| Field | Type | Required |
|-------|------|----------|
| Client name | text | yes |
| Client contact | text | no |
| Contract value | number | no |
| Currency | select | no |
| Contract start | date | no |
| Contract end | date | no |
| Payment status | select | no |
| Notes | textarea | no |

---

### 6. Calendar (`/calendar`)

**Content:**

```
Calendar                                    [Open Calendly]

[Upcoming]
┌─────────────────────────────────────────────────────────┐
│ Tomorrow, 10:00 AM                                      │
│ Discovery Call — John from TechCorp                     │
│ 30 min · Google Meet                                    │
├─────────────────────────────────────────────────────────┤
│ Friday, 3:00 PM                                         │
│ Follow-up — Maria from StartupX                         │
│ 15 min · Google Meet                                    │
└─────────────────────────────────────────────────────────┘

[Past calls - collapsed by default]
```

**Features v1:**
- Embedded Calendly widget or link
- If webhooks configured: list of upcoming/past events
- Link events to projects (optional)

**Note:** Calendly free has limited API. Start with embed/link, add webhook integration later.

---

### 7. Settings (`/settings`)

**Sections:**

```
Settings

─── Profile ────────────────────────────────────────────────
Name: Nico
Email: nico@dinnartec.com
Username: nico

─── Team (Admin only) ──────────────────────────────────────
Manage team members, roles, and access.
[Manage Team →]

─── Verticals (Admin only) ─────────────────────────────────
Manage verticals configuration.
[Manage Verticals →]

─── Integrations ───────────────────────────────────────────
Calendly: Connected ✓
GitHub: Connected ✓
```

---

## Components Needed

### Layout
- `Sidebar` — Navigation sidebar, collapsible
- `Header` — Top bar with user menu
- `PageContainer` — Consistent page wrapper

### Common
- `Button` — Primary, secondary, ghost variants
- `Input` — Text, email, number inputs
- `Select` — Dropdown select
- `Textarea` — Multi-line input
- `Badge` — Status badges with colors
- `Card` — Content cards
- `Avatar` — User avatars
- `Modal` — Dialog/modal windows
- `Tabs` — Tab navigation
- `EmptyState` — When no data to show

### Project-specific
- `ProjectCard` — Project list item
- `ProjectHeader` — Project detail header
- `RepoItem` — Repository list item
- `LinkItem` — Link list item
- `TeamMember` — Team member item
- `VerticalFilter` — Filter tabs by vertical
- `StatusBadge` — Colored status indicator

### Calendar
- `EventCard` — Calendar event item
- `CalendlyEmbed` — Embedded Calendly widget

---

## User Flows

### Authentication
1. User visits any page
2. If not authenticated → redirect to `/login`
3. User clicks "Sign in with GitHub"
4. GitHub OAuth flow
5. If email whitelisted → create/update user, redirect to `/`
6. If email not whitelisted → show error, deny access

### Create Project
1. User clicks "New Project" from projects page or home
2. Modal or page opens with form
3. User fills required fields (name, codename, vertical)
4. If vertical is Solutions → show additional fields
5. User submits → project created
6. Redirect to project detail page

### Add Repo to Project
1. User on project detail page
2. Clicks "Add Repo"
3. Modal with fields: name, URL, type, is_primary
4. User submits → repo linked to project
5. Modal closes, list updates

---

## API Routes (Next.js)

```
/api/auth/[...nextauth]  — NextAuth handlers
/api/projects            — GET (list), POST (create)
/api/projects/[id]       — GET, PATCH, DELETE
/api/projects/[id]/repos — GET, POST
/api/projects/[id]/links — GET, POST
/api/projects/[id]/team  — GET, POST, DELETE
/api/users               — GET (list), POST (invite)
/api/users/[id]          — GET, PATCH
/api/verticals           — GET
/api/calendar/events     — GET (if webhook integration)
```

---

## Permissions

| Action | Admin | Member | Viewer |
|--------|-------|--------|--------|
| View all projects | ✓ | ✓ | ✓ |
| Create project | ✓ | ✓ | ✗ |
| Edit any project | ✓ | ✗ | ✗ |
| Edit assigned project | ✓ | ✓ | ✗ |
| Delete project | ✓ | ✗ | ✗ |
| Manage team | ✓ | ✗ | ✗ |
| Manage verticals | ✓ | ✗ | ✗ |
| View settings | ✓ | ✓ | ✓ |

---

## Responsive Behavior

**Desktop (1024px+):**
- Full sidebar visible
- Multi-column layouts where appropriate

**Tablet (768px - 1023px):**
- Collapsible sidebar (icon-only or hidden)
- Single column content

**Mobile (<768px):**
- Hidden sidebar, hamburger menu
- Full-width cards and forms
- Bottom navigation alternative (optional)

---

## Future Enhancements (v2+)

- [ ] Activity log / audit trail
- [ ] Project milestones and tasks
- [ ] GitHub integration (auto-sync repos, show activity)
- [ ] Calendly webhook integration
- [ ] Time tracking per project
- [ ] Revenue/metrics dashboard for Solutions
- [ ] Notifications system
- [ ] Dark mode toggle

---

## Pending Items

- [ ] Calendly account setup for webhooks
- [ ] GitHub OAuth app creation
- [ ] Supabase project setup
- [ ] Whitelisted emails list
- [ ] Vercel deployment setup

---

*Document version: 1.0 — January 2026*
