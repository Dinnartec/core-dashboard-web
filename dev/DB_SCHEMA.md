# Database Schema — Dinnartec Dashboard

## Overview

- **Database:** Supabase (PostgreSQL)
- **Approach:** Relacional, normalizado, escalable
- **Auth:** Supabase Auth + GitHub OAuth

---

## Entity Relationship

```
users
  │
  ├──< team_members >── projects
  │                        │
  │                        ├──< project_repos
  │                        │
  │                        ├──< project_links
  │                        │
  │                        └──< solutions_metadata (solo si vertical = solutions)
  │
  └── roles
```

---

## Tables

### users

Usuarios del dashboard (syncs with Supabase Auth).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, default uuid_generate_v4() | |
| username | varchar(50) | unique, not null | Unique identifier, can come from GitHub |
| email | varchar(255) | unique, not null | |
| name | varchar(255) | not null | Display name |
| avatar_url | text | nullable | From GitHub |
| role_id | uuid | FK → roles.id, not null | |
| is_active | boolean | default true | Soft disable |
| created_at | timestamptz | default now() | |
| updated_at | timestamptz | default now() | |

**Indexes:**
```sql
CREATE INDEX idx_users_username ON users(username);
```

---

### roles

User roles (scalable for granular permissions later).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, default uuid_generate_v4() | |
| name | varchar(50) | unique, not null | admin, member, viewer, etc. |
| description | text | nullable | |
| created_at | timestamptz | default now() | |

**Seed inicial:**
```sql
INSERT INTO roles (name, description) VALUES
  ('admin', 'Full access to all features'),
  ('member', 'Can view and edit assigned projects'),
  ('viewer', 'Read-only access');
```

---

### verticals

Dinnartec verticals (separate table for flexibility).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, default uuid_generate_v4() | |
| slug | varchar(50) | unique, not null | core, solutions, factory, labs |
| name | varchar(100) | not null | Display name |
| description | text | nullable | |
| is_active | boolean | default true | |
| display_order | int | default 0 | For UI ordering |
| created_at | timestamptz | default now() | |

**Seed inicial:**
```sql
INSERT INTO verticals (slug, name, description, display_order) VALUES
  ('core', 'Core', 'Internal infrastructure and shared resources', 1),
  ('solutions', 'Dinnartec Solutions', 'Client services and consulting', 2),
  ('factory', 'Dinnartec Factory', 'Proprietary products', 3),
  ('labs', 'Dinnartec Labs', 'Research and development', 4);
```

---

### project_statuses

Possible project statuses (separate table for scalability).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, default uuid_generate_v4() | |
| slug | varchar(50) | unique, not null | planning, in_progress, paused, launched, archived |
| name | varchar(100) | not null | Display name |
| color | varchar(7) | nullable | Hex color para UI |
| display_order | int | default 0 | |
| created_at | timestamptz | default now() | |

**Seed inicial:**
```sql
INSERT INTO project_statuses (slug, name, color, display_order) VALUES
  ('planning', 'Planning', '#6B7280', 1),
  ('in_progress', 'In Progress', '#3B82F6', 2),
  ('paused', 'Paused', '#F59E0B', 3),
  ('launched', 'Launched', '#10B981', 4),
  ('archived', 'Archived', '#9CA3AF', 5);
```

---

### projects

Main projects table.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, default uuid_generate_v4() | |
| name | varchar(255) | not null | Commercial or public name |
| codename | varchar(100) | unique, not null | Internal name (quest, vault, etc.) |
| vertical_id | uuid | FK → verticals.id, not null | |
| status_id | uuid | FK → project_statuses.id, not null | |
| description | text | nullable | |
| started_at | date | nullable | Start date |
| launched_at | date | nullable | Launch date |
| is_active | boolean | default true | Soft delete |
| created_at | timestamptz | default now() | |
| updated_at | timestamptz | default now() | |

**Indexes:**
```sql
CREATE INDEX idx_projects_vertical ON projects(vertical_id);
CREATE INDEX idx_projects_status ON projects(status_id);
CREATE INDEX idx_projects_codename ON projects(codename);
```

---

### project_repos

Repositories linked to a project (1 project → N repos).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, default uuid_generate_v4() | |
| project_id | uuid | FK → projects.id, not null, on delete cascade | |
| name | varchar(255) | not null | Repository name |
| url | text | not null | Full GitHub URL |
| type | varchar(50) | nullable | web, api, app, docs, etc. |
| is_primary | boolean | default false | Main project repo |
| created_at | timestamptz | default now() | |

**Indexes:**
```sql
CREATE INDEX idx_project_repos_project ON project_repos(project_id);
```

---

### project_links

Additional links (deploy, docs, figma, etc.).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, default uuid_generate_v4() | |
| project_id | uuid | FK → projects.id, not null, on delete cascade | |
| label | varchar(100) | not null | "Production", "Staging", "Docs", "Figma" |
| url | text | not null | |
| type | varchar(50) | nullable | deploy, docs, design, other |
| created_at | timestamptz | default now() | |

**Indexes:**
```sql
CREATE INDEX idx_project_links_project ON project_links(project_id);
```

---

### team_members

User ↔ Project relationship (many to many).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, default uuid_generate_v4() | |
| project_id | uuid | FK → projects.id, not null, on delete cascade | |
| user_id | uuid | FK → users.id, not null, on delete cascade | |
| role | varchar(50) | default 'member' | Role within project: lead, member |
| assigned_at | timestamptz | default now() | |

**Constraints:**
```sql
ALTER TABLE team_members ADD CONSTRAINT unique_project_user UNIQUE (project_id, user_id);
```

**Indexes:**
```sql
CREATE INDEX idx_team_members_project ON team_members(project_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);
```

---

### solutions_metadata

Additional metadata only for Solutions projects (clients).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, default uuid_generate_v4() | |
| project_id | uuid | FK → projects.id, unique, not null, on delete cascade | 1:1 with project |
| client_name | varchar(255) | not null | Client name |
| client_contact | varchar(255) | nullable | Email or contact |
| contract_value | decimal(12,2) | nullable | Contract value |
| currency | varchar(3) | default 'USD' | |
| contract_start | date | nullable | |
| contract_end | date | nullable | |
| payment_status | varchar(50) | default 'pending' | pending, partial, paid |
| notes | text | nullable | Internal notes |
| created_at | timestamptz | default now() | |
| updated_at | timestamptz | default now() | |

---

## Future Tables (not implemented yet)

These tables can be added later without breaking the current schema:

### activity_logs (future)

```sql
-- To track changes in projects
CREATE TABLE activity_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action varchar(50) NOT NULL, -- created, updated, status_changed, etc.
  entity_type varchar(50) NOT NULL, -- project, repo, link, etc.
  entity_id uuid,
  old_value jsonb,
  new_value jsonb,
  created_at timestamptz DEFAULT now()
);
```

### project_milestones (future)

```sql
-- To track milestones/tasks
CREATE TABLE project_milestones (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  title varchar(255) NOT NULL,
  description text,
  due_date date,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);
```

### calendar_events (future)

```sql
-- To store Calendly events via webhooks
CREATE TABLE calendar_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  external_id varchar(255) UNIQUE, -- Calendly ID
  title varchar(255) NOT NULL,
  description text,
  event_type varchar(50), -- call, meeting, etc.
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  attendee_email varchar(255),
  attendee_name varchar(255),
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL, -- Optional: link to project
  status varchar(50) DEFAULT 'scheduled', -- scheduled, completed, cancelled
  raw_data jsonb, -- Full Calendly data
  created_at timestamptz DEFAULT now()
);
```

---

## Row Level Security (RLS)

Supabase RLS policies for security:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
-- ... etc for each table

-- Policy example: admins see everything, members only their projects
CREATE POLICY "Admins can view all projects" ON projects
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role_id = (SELECT id FROM roles WHERE name = 'admin')
    )
  );

CREATE POLICY "Members can view assigned projects" ON projects
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.project_id = projects.id
      AND team_members.user_id = auth.uid()
    )
  );
```

---

## Notes

1. **UUIDs everywhere** — better for distributed systems and security
2. **Soft deletes** — `is_active` instead of deleting records
3. **Timestamps** — `created_at` and `updated_at` on all tables
4. **Lookup tables** — roles, verticals, statuses are separate tables for flexibility
5. **Scalable** — easy to add activity_logs, milestones, etc. later

---

*Schema version: 1.0 — January 2026*
