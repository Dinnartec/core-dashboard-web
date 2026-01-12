export type Vertical = 'core' | 'solutions' | 'factory' | 'labs'

export type ProjectStatus = 'planning' | 'in_progress' | 'paused' | 'launched' | 'archived'

export type UserRole = 'admin' | 'member' | 'viewer'

export type TeamRole = 'lead' | 'member'

export interface User {
  id: string
  username: string
  email: string
  name: string
  avatar_url?: string
  role_id: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  codename: string
  vertical_id: string
  status_id: string
  description?: string
  started_at?: string
  launched_at?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProjectRepo {
  id: string
  project_id: string
  name: string
  url: string
  type?: string
  is_primary: boolean
  created_at: string
}

export interface ProjectLink {
  id: string
  project_id: string
  label: string
  url: string
  type?: string
  created_at: string
}

export interface TeamMember {
  id: string
  project_id: string
  user_id: string
  role: TeamRole
  assigned_at: string
}
